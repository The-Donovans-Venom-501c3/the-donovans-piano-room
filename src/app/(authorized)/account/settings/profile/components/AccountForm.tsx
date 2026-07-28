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
        // Extract updatable values from profile state
        const { fullName, displayName, email, phoneNumber, pronouns, DOB } = profile
        const { data, ok } = await updateUser({ fullName, displayName, email, phoneNumber, pronouns, DOB })
        
        if (ok) {
            setIsDataSaved(true)
        } else {
            alert(`Error: ${data?.message || 'Something went wrong'}`)
            window.location.href = "/login"
        }
    }

    const closeSuccessPopup = () => {
        setIsDataSaved(false)
    }

    return (
        <div className='w-full lg:w-[70%] xl:w-[60%] font-montserrat px-4 md:px-0'>
            {/* Header Title */}
            <h1 className='mt-[3vh] text-4xl font-medium text-primary-brown md:text-5xl 3xl:text-6xl 4xl:text-7xl'>
                Your profile
            </h1>
            
            {/* Header Subtext */}
            <p className='mt-2 w-full text-lg text-primary-gray md:text-2xl 3xl:text-3xl 4xl:text-4xl md:w-[90%]'>
                Update your profile information to ensure your account reflects the latest details about you.
            </p>
            
            {/* Divider Line */}
            <div className='my-[4vh] h-1 bg-[#FED2AA]'></div>

            {/* Profile Form */}
            <form className='flex flex-col gap-6' onSubmit={submitChanges}>
                <div className='flex flex-col gap-6 md:flex-row md:items-stretch md:gap-[2vh]'>
                    
                    {/* Left Column */}
                    <div className='flex w-full flex-col justify-between gap-[1.5vw] md:w-[49%]'>
                        {/* Disabled Full Name */}
                        <InputForm 
                            error='' 
                            text={profile?.fullName || ''} 
                            onChange={onChange} 
                            disabled={true}
                            field={{ label: "Full name", type: "text", name: "fullName" }} 
                        />

                        {/* Pronouns Selection */}
                        <SelectInput 
                            label='Pronouns' 
                            name='pronouns' 
                            onChange={onChange} 
                            options={allPronouns} 
                            value={profile?.pronouns || ''} 
                        />

                        {/* Disabled Email */}
                        <InputForm 
                            error='' 
                            text={profile?.email || ''} 
                            onChange={onChange} 
                            disabled={true}
                            field={{ label: "Email address", type: "email", name: "email" }} 
                        />
                    </div>

                    {/* Right Column */}
                    <div className='flex w-full flex-col justify-between gap-[1.5vw] md:w-[49%]'>
                        {/* Display Name */}
                        <InputForm 
                            error='' 
                            text={profile?.displayName || ''} 
                            onChange={onChange} 
                            field={{ label: "Display name", type: "text", name: "displayName" }} 
                        />

                        {/* Date of Birth */}
                        <DateInput 
                            label='Date of birth' 
                            onChange={onChange} 
                            defaultValue={profile?.DOB} 
                            name="DOB" 
                        />

                        {/* Phone Number */}
                        <InputForm 
                            error='' 
                            text={profile?.phoneNumber || ''} 
                            onChange={onChange} 
                            field={{ label: "Phone number", type: "text", name: "phoneNumber" }} 
                        />
                    </div>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end mt-4">
                    <Button3 
                        text='Save changes' 
                        style={{ minWidth: "140px", width: "11vw" }} 
                    />
                </div>
            </form>

            {/* Inline Success Popup Banner */}
            {isDataSaved && (
                <div className="mt-6">
                    <SuccessPopup closeSuccessPopup={closeSuccessPopup} />
                </div>
            )}

            {/* Support Message */}
            <p className='mt-[4vh] text-lg font-normal text-primary-brown md:text-2xl 3xl:text-3xl'>
                To update your Full Name or Email Address, please{' '}
                <Link href='/contact-page' className='font-medium text-primary-purple underline hover:opacity-80 transition-opacity'>
                    contact us
                </Link>
                .
            </p>
        </div>
    )
}