import Button1 from '@/components/atoms/Button1'
import Button3 from '@/components/atoms/Button3'
import DateInput from '@/components/atoms/DateInput'
import InputForm from '@/components/atoms/form-input'
import SelectInput from '@/components/atoms/select-input'
import { profile, pronouns as allPronouns } from '@/utils/general'
import React, { useEffect, useState } from 'react'
import SuccessPopup from './SuccessPopup'
import AvatarSelectPopup from './AvatarSelectPopup'
import { useSetAtom } from 'jotai'
import { profileAtom } from '@/utils/stores'

export default function AccountForm() {
    const [fullName, setFullName] = useState(profile.fullName)
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState(profile.email)
    const [pronouns, setPronouns] = useState(profile.pronouns)
    const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber)
    const [birthDate, setBirthDate] = useState(profile.birthDate)
    const [isDataSaved, setIsDataSaved] = useState(false)
    const [avatar, setAvatar] = useState(profile.imageSrc)
    const [selectingAvatar, setSelectingAvatar] = useState(true)
    const setProfile = useSetAtom(profileAtom)
    const closeSelectingAvatar = () => {
        setSelectingAvatar(false)
    }
    const submitChanges = (e: any) => {
        e.preventDefault()
        setIsDataSaved(true)
    }
    const closeSuccessPopup = () =>{
        setIsDataSaved(false)
    }
    useEffect(()=>{
        setProfile(profile)
    }, [])
  return (
    <div className='w-[60%]'>
        <h1 className='text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]'>Your profile</h1>
        <p className='text-primary-gray text-2xl 3xl:text-3xl 4xl:text-4xl w-[90%]'>Update your profile information to ensure your account reflects the latest details about you.</p>
        <div className='mt-[5vh] mb-[5vh] bg-[#FED2AA] h-1'></div>
        <form className='flex flex-col flex gap-[4%]' onSubmit={submitChanges}>
            <div className='flex gap-[2vh]'>

                <div className='w-[49%] flex flex-col gap-[1vw]'>
                    <InputForm error='' text={fullName} onChange={(e: any) => setFullName(e.target.value)} field={{label: "Full name", type: "text", name: "full-name"}}/>
                    <SelectInput label='Pronouns' name='pronouns' onChange={(e: any) => setPronouns(e.target.value)} options={allPronouns} value={pronouns}/>
                    <InputForm error='' text={email} onChange={(e: any) => setEmail(e.target.value)} field={{label: "Email", type: "email", name: "email"}}/>

                </div>
                <div className='w-[49%] flex flex-col gap-[1vw]'>
                    <InputForm error='' text={displayName} onChange={(e: any) => setDisplayName(e.target.value)} field={{label: "Display name", type: "text", name: "display-name"}}/>
                    <DateInput label='Date of birth' onChange={(e:any) => {console.log(typeof e.target.value), setBirthDate(e.target.value)}} defaultValue={birthDate}/>
                    <InputForm error='' text={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} field={{label: "Phone number", type: "text", name: "phone-number"}}/>
                </div>
            </div>
            <Button3 text='Save changes' style={{width: "11vw", marginTop: "3%", alignSelf: "flex-end"}}/>
        </form>
        {isDataSaved && <SuccessPopup closeSuccessPopup={closeSuccessPopup}/>}
        {selectingAvatar && <AvatarSelectPopup avatar={avatar} setAvatar={setAvatar} closeSelectingAvatar={closeSelectingAvatar} />}
    </div>
  )
}
