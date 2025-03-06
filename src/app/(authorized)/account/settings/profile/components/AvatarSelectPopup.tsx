import Button3 from '@/components/atoms/Button3';
import { profileAtom } from '@/utils/stores';
import CloseIcon from '@mui/icons-material/Close';
import { useAtomValue, useSetAtom } from 'jotai';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { updateUser } from '@/lib/api/userService';

export default function AvatarSelectPopup({avatar, setAvatar, closeSelectingAvatar}: {avatar: string, setAvatar: any, closeSelectingAvatar: any}) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatar)
  const setProfile = useSetAtom(profileAtom)
  const profile = useAtomValue(profileAtom)
  const popupRef = useRef<HTMLDivElement>(null)
  const handleClickOutside = (e: any) => {
    if (!!popupRef.current && !popupRef.current.contains(e.target)) {
      closeSelectingAvatar()
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  const submitNewAvatar = async() => {
    const {data, ok} = await updateUser({picture: selectedAvatar, email: profile.email});
    if(ok){
      setProfile((prev: any) => {
        const newProfile = {...prev, picture: selectedAvatar} 
        return newProfile
      })
    }
    closeSelectingAvatar()
  }
  return (
    <div className='absolute w-[100vw] h-[100vh] z-[220] bg-[black] bg-opacity-50 top-[-9.7vh] left-[-14.5vw]'>
      <div ref={popupRef} className="absolute w-[30vw] h-[40vh] bg-primary-skin rounded-2xl bottom-[15vh] right-[5vw] px-[2vw] py-[3vh]" style={avatar !== selectedAvatar ? {height: "47vh"} : {}}>
        <div className="flex justify-between">
          <p className='text-3xl 3xl:text-4xl 4xl:text-5xl'>Select your avatar</p>
          <CloseIcon className='text-4xl 3xl:text-5xl 4xl:text-6xl' onClick={closeSelectingAvatar}/>
        </div>
        <div className='grid grid-cols-3 grid-rows-2 mt-[3vh] gap-y-6'>
          <div className='relative w-[13vh] h-[13vh] rounded-full border-primary-purple' onClick={() => setSelectedAvatar(avatars[2])} style={avatars[2] == selectedAvatar ? {borderWidth: "3px"} : {}}>
            <Image src="/ToBeRemoved/avatar/2.svg" fill alt='' />
          </div>

          <div className='relative w-[13vh] h-[13vh] rounded-full border-primary-purple' onClick={() => setSelectedAvatar(avatars[3])} style={avatars[3] == selectedAvatar ? {borderWidth: "3px"} : {}}>
            <Image src="/ToBeRemoved/avatar/3.svg" fill alt='' />
          </div>

          <div className='relative w-[13vh] h-[13vh] rounded-full border-primary-purple' onClick={() => setSelectedAvatar(avatars[4])} style={avatars[4] == selectedAvatar ? {borderWidth: "3px"} : {}}>
            <Image src="/ToBeRemoved/avatar/4.svg" fill alt='' />
          </div>
          <div className='relative w-[13vh] h-[13vh] rounded-full border-primary-purple' onClick={() => setSelectedAvatar(avatars[1])} style={avatars[1] == selectedAvatar ? {borderWidth: "3px"} : {}}>
            <Image src="/ToBeRemoved/avatar/1.svg" fill alt='' />
          </div>

          <div className='relative w-[13vh] h-[13vh] rounded-full border-primary-purple' onClick={() => setSelectedAvatar(avatars[5])} style={avatars[5] == selectedAvatar ? {borderWidth: "3px"} : {}}>
            <Image src="/ToBeRemoved/avatar/5.svg" fill alt='' />
          </div>

          <div className='relative w-[13vh] h-[13vh] rounded-full border-primary-purple' onClick={() => setSelectedAvatar(avatars[6])} style={avatars[6] == selectedAvatar ? {borderWidth: "3px"} : {}}>
            <Image src="/ToBeRemoved/avatar/6.svg" fill alt='' />
          </div>
        </div>
        {selectedAvatar !== avatar && <div className='flex w-full justify-end'>
          <Button3 text='Save changes' style={{marginTop: "18px", width: "10vw"}} onClick={submitNewAvatar}/>

        </div>}
      </div>
    </div>
  )
}

const avatars = {
  1: "/ToBeRemoved/avatar/1.svg",
  2: "/ToBeRemoved/avatar/2.svg",
  3: "/ToBeRemoved/avatar/3.svg",
  4: "/ToBeRemoved/avatar/4.svg",
  5: "/ToBeRemoved/avatar/5.svg",
  6: "/ToBeRemoved/avatar/6.svg"
}
