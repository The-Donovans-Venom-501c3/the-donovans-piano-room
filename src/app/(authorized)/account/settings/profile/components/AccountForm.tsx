'use client'

import Button3 from '@/components/atoms/Button3'
import DateInput from '@/components/atoms/DateInput'
import InputForm from '@/components/atoms/form-input'
import SelectInput from '@/components/atoms/select-input'
import { pronouns as allPronouns } from '@/utils/general'
import { updateUser } from '@/lib/api/userService'
import { profileAtom } from '@/utils/stores'

import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import Link from 'next/link'
import dayjs from 'dayjs'

type EditableFields = {
    displayName: string
    phoneNumber: string
    pronouns: string
}

export default function AccountForm() {
    const [profile, setProfile] = useAtom(profileAtom)

    const [formValues, setFormValues] = useState<EditableFields>({
        displayName: '',
        phoneNumber: '',
        pronouns: '',
    })

    const [previousValues, setPreviousValues] =
        useState<EditableFields | null>(null)

    const [error, setError] = useState('')
    const [isDataSaved, setIsDataSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const todayStr = dayjs().format('YYYY-MM-DD')

    // Populate the editable fields when the saved profile changes.
    useEffect(() => {
        setFormValues({
            displayName: profile?.displayName || '',
            phoneNumber: profile?.phoneNumber || '',
            pronouns: profile?.pronouns || '',
        })
    }, [
        profile?.displayName,
        profile?.phoneNumber,
        profile?.pronouns,
    ])

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        if (
            name !== 'displayName' &&
            name !== 'phoneNumber' &&
            name !== 'pronouns'
        ) {
            return
        }

        setError('')
        setIsDataSaved(false)
        setPreviousValues(null)

        const nextValue =
            name === 'phoneNumber'
                ? value.replace(/\D/g, '')
                : value

        setFormValues((previous) => ({
            ...previous,
            [name]: nextValue,
        }))
    }

    const submitChanges = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        if (!profile || isSaving) return

        setError('')
        setIsDataSaved(false)

        const email = profile.email

        if (
            formValues.phoneNumber &&
            /\D/.test(formValues.phoneNumber)
        ) {
            setError('Phone number must contain only numbers!')
            return
        }

        if (
            process.env.NEXT_PUBLIC_RESTRICT_TO_ORG_DOMAIN ===
                'true' &&
            !email?.trim().toLowerCase().endsWith('@thedonovan.org')
        ) {
            setError('Please use your thedonovan.org email!')
            return
        }

        const beforeSave: EditableFields = {
            displayName: profile.displayName || '',
            phoneNumber: profile.phoneNumber || '',
            pronouns: profile.pronouns || '',
        }

        const changes: EditableFields = {
            ...formValues,
        }

        setIsSaving(true)

        try {
            // DOB is read-only, so it is intentionally excluded.
            const { data, ok } = await updateUser({
                email,
                ...changes,
            })

            if (!ok) {
                setError(data?.message || 'Unable to save changes.')
                return
            }

            setPreviousValues(beforeSave)

            setProfile((previous) =>
                previous
                    ? {
                          ...previous,
                          ...changes,
                      }
                    : previous
            )

            setIsDataSaved(true)
        } catch (error) {
            console.error('Failed to update profile:', error)
            setError('Unable to save changes. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleUndo = async () => {
        if (!profile || !previousValues || isSaving) return

        const restoredValues = { ...previousValues }

        setError('')
        setIsSaving(true)

        try {
            // Persist the undo instead of changing only local state.
            const { data, ok } = await updateUser({
                email: profile.email,
                ...restoredValues,
            })

            if (!ok) {
                setError(data?.message || 'Unable to undo changes.')
                return
            }

            setProfile((previous) =>
                previous
                    ? {
                          ...previous,
                          ...restoredValues,
                      }
                    : previous
            )

            setFormValues(restoredValues)
            setPreviousValues(null)
            setIsDataSaved(false)
        } catch (error) {
            console.error('Failed to undo profile changes:', error)
            setError('Unable to undo changes. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    if (!profile) return null

    return (
        <div className="w-[60%] flex flex-col justify-between min-h-[75vh]">
            <div>
                <h1 className="text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]">
                    Your profile
                </h1>

                <p className="text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl w-[90%] mt-2">
                    Update your profile information to ensure your
                    account reflects the latest details about you.
                </p>

                <div className="mt-[5vh] mb-[5vh] bg-[#FED2AA] h-1" />

                <form
                    className="flex flex-col gap-[4%]"
                    onSubmit={submitChanges}
                    aria-busy={isSaving}
                >
                    <fieldset
                        disabled={isSaving}
                        className="m-0 min-w-0 border-0 p-0 disabled:opacity-70"
                    >
                        <div className="flex gap-[2vh]">
                            {/* Left column */}
                            <div className="w-[49%] flex flex-col gap-[1vw]">
                                <InputForm
                                    error=""
                                    text={profile.fullName || ''}
                                    onChange={onChange}
                                    disabled={true}
                                    field={{
                                        label: 'Full name',
                                        type: 'text',
                                        name: 'fullName',
                                    }}
                                />

                                <SelectInput
                                    label="Pronouns"
                                    name="pronouns"
                                    onChange={onChange}
                                    options={allPronouns}
                                    value={formValues.pronouns}
                                />

                                <InputForm
                                    error=""
                                    text={profile.email || ''}
                                    onChange={onChange}
                                    disabled={true}
                                    field={{
                                        label: 'Email address',
                                        type: 'email',
                                        name: 'email',
                                    }}
                                />
                            </div>

                            {/* Right column */}
                            <div className="w-[49%] flex flex-col gap-[1vw]">
                                <InputForm
                                    error=""
                                    text={formValues.displayName}
                                    onChange={onChange}
                                    field={{
                                        label: 'Display name',
                                        type: 'text',
                                        name: 'displayName',
                                    }}
                                />

                                <DateInput
                                    label="Date of birth"
                                    onChange={onChange}
                                    value={profile.DOB || ''}
                                    name="DOB"
                                    max={todayStr}
                                    disabled={true}
                                />

                                <InputForm
                                    error=""
                                    text={formValues.phoneNumber}
                                    onChange={onChange}
                                    field={{
                                        label: 'Phone number',
                                        type: 'tel',
                                        name: 'phoneNumber',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-[3%]">
                            <Button3
                                text={
                                    isSaving
                                        ? 'Saving...'
                                        : 'Save changes'
                                }
                                style={{ width: '11vw' }}
                            />
                        </div>
                    </fieldset>

                    {/* Display errors once, not underneath Email. */}
                    {error && (
                        <p
                            role="alert"
                            className="text-red-600 font-semibold text-lg mt-2"
                        >
                            {error}
                        </p>
                    )}
                </form>

                {isDataSaved && (
                    <div
                        role="status"
                        className="mt-6 w-full bg-[#FFDF2B] rounded-2xl p-5 flex justify-between items-center text-black font-semibold shadow-sm"
                    >
                        <div className="flex items-center gap-3 text-2xl 3xl:text-3xl">
                            <div
                                aria-hidden="true"
                                className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-sm font-bold"
                            >
                                ✓
                            </div>

                            <span>New changes saved!</span>
                        </div>

                        <div className="flex items-center gap-6 text-2xl 3xl:text-3xl">
                            <button
                                type="button"
                                onClick={handleUndo}
                                disabled={
                                    isSaving || !previousValues
                                }
                                className="font-bold underline text-black hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Undoing...' : 'Undo'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsDataSaved(false)
                                    setPreviousValues(null)
                                }}
                                disabled={isSaving}
                                aria-label="Close notification"
                                className="text-gray-800 hover:text-black text-2xl font-bold ml-2 disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-black text-lg font-medium">
                To update your Full Name, Email Address, or Date
                of Birth, please{' '}
                <Link
                    href="/contact-page"
                    className="text-purple-700 underline font-semibold"
                >
                    contact us
                </Link>
                .
            </p>
        </div>
    )
}