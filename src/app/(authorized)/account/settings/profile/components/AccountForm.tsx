import Button3 from '@/components/atoms/Button3'
import DateInput from '@/components/atoms/DateInput'
import InputForm from '@/components/atoms/form-input'
import SelectInput from '@/components/atoms/select-input'
import { pronouns as allPronouns } from '@/utils/general'
import React, { useState } from 'react'
import SuccessPopup from './SuccessPopup'
import { updateUser } from '@/lib/api/userService'
import { useAtom } from 'jotai'
import { profileAtom } from '@/utils/stores'
import Link from 'next/link'

export default function AccountForm() {
    const [profile, setProfile] = useAtom(profileAtom)
    const [isDataSaved, setIsDataSaved] = useState(false)

    const onChange = (e: any) => {
        setProfile({ ...profile, [e.target.name]: e.target.value })
    }

    const submitChanges = async (e: any) => {
        e.preventDefault()
        // Omit fullName and email since they cannot be edited
        const { displayName, phoneNumber, pronouns, DOB } = profile
        const { data, ok } = await updateUser({ displayName, phoneNumber, pronouns, DOB })
        
        if (ok) {
            setIsDataSaved(true)
        } else {
            alert(`Error: ${data.message}`)
            window.location.href = "/login"
        }
    }

    const closeSuccessPopup = () => {
        setIsDataSaved(false)
    }

    return (
        <div className='w-[60%] font-montserrat'>
            <h1 className='text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-medium mt-[3vh]'>
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
                        {/* Read-only / Non-editable Full Name */}
                        <div className='flex flex-col gap-1'>
                            <label className='text-xl 3xl:text-2xl text-[#8E8E8E] font-medium'>
                                Full name
                            </label>
                            <div className='bg-[#FFF8EE] px-5 py-3 rounded-2xl text-2xl 3xl:text-3xl text-primary-brown font-normal select-none cursor-not-allowed'>
                                {profile.fullName}
                            </div>
                        </div>

                        <SelectInput 
                            label='Pronouns' 
                            name='pronouns' 
                            onChange={onChange} 
                            options={allPronouns} 
                            value={profile.pronouns} 
                        />

                        {/* Read-only / Non-editable Email */}
                        <div className='flex flex-col gap-1'>
                            <label className='text-xl 3xl:text-2xl text-[#8E8E8E] font-medium'>
                                Email address
                            </label>
                            <div className='bg-[#FFF8EE] px-5 py-3 rounded-2xl text-2xl 3xl:text-3xl text-primary-brown font-normal select-none cursor-not-allowed'>
                                {profile.email}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='w-[49%] flex flex-col gap-[1vw]'>
                        <InputForm 
                            error='' 
                            text={profile.displayName} 
                            onChange={onChange} 
                            field={{ label: "Display name", type: "text", name: "displayName" }} 
                        />
                        <DateInput 
                            label='Date of birth' 
                            onChange={onChange} 
                            defaultValue={profile.DOB} 
                            name="DOB" 
                        />
                        <InputForm 
                            error='' 
                            text={profile.phoneNumber} 
                            onChange={onChange} 
                            field={{ label: "Phone number", type: "text", name: "phoneNumber" }} 
                        />
                    </div>
                </div>

                <Button3 
                    text='Save changes' 
                    style={{ width: "11vw", marginTop: "3%", alignSelf: "flex-end" }} 
                />
            </form>

            {/* Support Message */}
            <p className='mt-[4vh] text-2xl 3xl:text-3xl text-primary-brown'>
                To update your Full Name or Email Address, please{' '}
                <Link href='/contact' className='underline font-medium text-primary-purple'>
                    contact us
                </Link>
                .
            </p>

            {isDataSaved && <SuccessPopup closeSuccessPopup={closeSuccessPopup} />}
        </div>
    )
}