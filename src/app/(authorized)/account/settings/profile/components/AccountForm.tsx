import Button1 from '@/components/atoms/Button1'
import Button3 from '@/components/atoms/Button3'
import DateInput from '@/components/atoms/DateInput'
import InputForm from '@/components/atoms/form-input'
import SelectInput from '@/components/atoms/select-input'
import { pronouns as allPronouns } from '@/utils/general'
import React, { useEffect, useState } from 'react'
import SuccessPopup from './SuccessPopup'
import { updateUser, getUser } from '@/lib/api/userService'
import { useAtom } from 'jotai';
import { profileAtom } from '@/utils/stores'

export default function AccountForm() {
    const [profile, setProfile] = useAtom(profileAtom)
    const [isDataSaved, setIsDataSaved] = useState(false)

    useEffect(()=>{
        const getProfile = async () =>{
            const {data, ok} = await getUser();
            if (ok){
                setProfile(data)
            } else {
                // alert(`Error: ${data.message}`);
                window.location.href = "/login"
            }
        }
        getProfile();
    }, [])

    const onChange = (e: any) => {
        setProfile({...profile, [e.target.name]: e.target.value})
    }
    const submitChanges = async (e: any) => {
        e.preventDefault()
        const {fullName, displayName, email, phoneNumber, pronouns, DOB} = profile;
        const {data, ok} = await updateUser(fullName, displayName, email, phoneNumber, pronouns, DOB);
        if (ok){
            setIsDataSaved(true)
        }
        else{
            alert(`Error: ${data.message}`);
            window.location.href = "/login"
        }
    }
    const closeSuccessPopup = () =>{
        setIsDataSaved(false)
    }
  return (
    <div className='w-[60%]'>
        <h1 className='text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]'>Your profile</h1>
        <p className='text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl w-[90%]'>Update your profile information to ensure your account reflects the latest details about you.</p>
        <div className='mt-[5vh] mb-[5vh] bg-[#FED2AA] h-1'></div>
        <form className='flex flex-col flex gap-[4%]' onSubmit={submitChanges}>
            <div className='flex gap-[2vh]'>

                <div className='w-[49%] flex flex-col gap-[1vw]'>
                    <InputForm error='' text={profile.fullName} onChange={onChange} field={{label: "Full name", type: "text", name: "fullName"}}/>
                    <SelectInput label='Pronouns' name='pronouns' onChange={onChange} options={allPronouns} value={profile.pronouns}/>
                    <InputForm error='' text={profile.email} onChange={onChange} field={{label: "Email", type: "email", name: "email"}}/>

                </div>
                <div className='w-[49%] flex flex-col gap-[1vw]'>
                    <InputForm error='' text={profile.displayName} onChange={onChange} field={{label: "Display name", type: "text", name: "displayName"}}/>
                    <DateInput label='Date of birth' onChange={onChange} defaultValue={profile.DOB} name="DOB"/>
                    <InputForm error='' text={profile.phoneNumber} onChange={onChange} field={{label: "Phone number", type: "text", name: "phoneNumber"}}/>
                </div>
            </div>
            <Button3 text='Save changes' style={{width: "11vw", marginTop: "3%", alignSelf: "flex-end"}}/>
        </form>
        {isDataSaved && <SuccessPopup closeSuccessPopup={closeSuccessPopup}/>}
    </div>
  )
}
