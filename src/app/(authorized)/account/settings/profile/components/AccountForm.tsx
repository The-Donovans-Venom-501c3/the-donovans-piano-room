import Button3 from '@/components/atoms/Button3'
import DateInput from '@/components/atoms/DateInput'
import InputForm from '@/components/atoms/form-input'
import SelectInput from '@/components/atoms/select-input'
import { pronouns as allPronouns } from '@/utils/general'
import React, { useState } from 'react'
import { updateUser } from '@/lib/api/userService'
import { useAtom } from 'jotai'
import { profileAtom } from '@/utils/stores'
import Link from 'next/link'
import dayjs from 'dayjs'

export default function AccountForm() {
    const [profile, setProfile] = useAtom(profileAtom)
    const [isDataSaved, setIsDataSaved] = useState(false)
    const [error, setError] = useState('')
    const [previousProfile, setPreviousProfile] = useState<any>(null)

    // Formatted today's date (YYYY-MM-DD)
    const todayStr = dayjs().format('YYYY-MM-DD');

    const onChange = (e: any) => {
        const { name, value } = e.target;

        if (error) {
            setError('')
        }

        // Restrict Phone Number input to digits only
        if (name === 'phoneNumber') {
            const numericValue = value.replace(/\D/g, ''); // Strips all non-digit characters
            if (profile) {
                setProfile({ ...profile, phoneNumber: numericValue });
            }
            return;
        }

        // Validate future date selection
        if (name === 'DOB' && value) {
            if (dayjs(value).isAfter(dayjs(), 'day')) {
                setError('Date of birth cannot be in the future!')
                return
            }
        }

        if (profile) {
            setProfile({ ...profile, [name]: value })
        }
    }

    const submitChanges = async (e: any) => {
        e.preventDefault()
        if (!profile) return

        setPreviousProfile(profile)
        const { fullName, displayName, email, phoneNumber, pronouns, DOB } = profile

        // Extra check: Ensure phone number contains only digits
        if (phoneNumber && /\D/.test(phoneNumber)) {
            setError('Phone number must contain only numbers!')
            return
        }

        // Prevent submit if DOB is in the future
        if (DOB && dayjs(DOB).isAfter(dayjs(), 'day')) {
            setError('Date of birth cannot be in the future!')
            return
        }

        if (process.env.NEXT_PUBLIC_RESTRICT_TO_ORG_DOMAIN === 'true') {
            if (!email?.trim().toLowerCase().endsWith('@thedonovan.org')) {
                setError('Please use your thedonovan.org email!')
                return
            }
        }

        const { data, ok } = await updateUser({ fullName, displayName, email, phoneNumber, pronouns, DOB })
        if (ok) {
            setIsDataSaved(true)
        } else {
            alert(`Error: ${data?.message || 'Update failed'}`)
            window.location.href = "/login"
        }
    }

    const handleUndo = () => {
        if (previousProfile) {
            setProfile(previousProfile)
            setIsDataSaved(false)
        }
    }

    if (!profile) return null

    return (
        <div className='w-[60%] flex flex-col justify-between min-h-[75vh]'>
            <div>
                <h1 className='text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]'>
                    Your profile
                </h1>
                <p className='text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl w-[90%] mt-2'>
                    Update your profile information to ensure your account reflects the latest details about you.
                </p>
                <div className='mt-[5vh] mb-[5vh] bg-[#FED2AA] h-1'></div>

                <form className='flex flex-col gap-[4%]' onSubmit={submitChanges}>
                    <div className='flex gap-[2vh]'>
                        {/* Left Column */}
                        <div className='w-[49%] flex flex-col gap-[1vw]'>
                            <InputForm 
                                error='' 
                                text={profile?.fullName || ''} 
                                onChange={onChange} 
                                disabled={true}
                                field={{ label: "Full name", type: "text", name: "fullName" }}
                            />
                            <SelectInput 
                                label='Pronouns' 
                                name='pronouns' 
                                onChange={onChange} 
                                options={allPronouns} 
                                value={profile?.pronouns || ''}
                            />
                            <InputForm 
                                error={error || ''} 
                                text={profile?.email || ''} 
                                onChange={onChange} 
                                disabled={true}
                                field={{ label: "Email address", type: "email", name: "email" }}
                            />
                        </div>

                        {/* Right Column */}
                        <div className='w-[49%] flex flex-col gap-[1vw]'>
                            <InputForm 
                                error='' 
                                text={profile?.displayName || ''} 
                                onChange={onChange} 
                                field={{ label: "Display name", type: "text", name: "displayName" }}
                            />
                            <DateInput 
                                label='Date of birth' 
                                onChange={onChange} 
                                value={profile?.DOB || ''} 
                                name="DOB"
                                max={todayStr}
                            />
                            <InputForm 
                                error='' 
                                text={profile?.phoneNumber || ''} 
                                onChange={onChange} 
                                field={{ label: "Phone number", type: "tel", name: "phoneNumber" }}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-600 font-semibold text-lg mt-2">{error}</p>
                    )}

                    <Button3 
                        text='Save changes' 
                        style={{ width: "11vw", marginTop: "3%", alignSelf: "flex-end" }}
                    />
                </form>

                {/* Yellow "New changes saved!" Banner */}
                {isDataSaved && (
                    <div className='mt-6 w-full bg-[#FFDF2B] rounded-2xl p-5 flex justify-between items-center text-black font-semibold shadow-sm'>
                        <div className='flex items-center gap-3 text-2xl 3xl:text-3xl'>
                            <div className='w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-sm font-bold'>
                                ✓
                            </div>
                            <span>New changes saved!</span>
                        </div>
                        <div className='flex items-center gap-6 text-2xl 3xl:text-3xl'>
                            <button 
                                type='button' 
                                onClick={handleUndo}
                                className='font-bold underline text-black hover:opacity-75'
                            >
                                Undo
                            </button>
                            <button 
                                type='button' 
                                onClick={() => setIsDataSaved(false)}
                                className='text-gray-800 hover:text-black text-2xl font-bold ml-2'
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Contact Help Text */}
            <p className='mt-8 text-black text-lg font-medium'>
                To update your Full Name or Email Address, please{' '}
                <Link href='/contact-page' className='text-purple-700 underline font-semibold'>
                    contact us
                </Link>.
            </p>
        </div>
    )
}