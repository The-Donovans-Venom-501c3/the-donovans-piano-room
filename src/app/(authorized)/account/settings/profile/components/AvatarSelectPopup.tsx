import Button3 from '@/components/atoms/Button3';
import { profileAtom } from '@/utils/stores';
import CloseIcon from '@mui/icons-material/Close';
import { useAtomValue, useSetAtom } from 'jotai';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { updateUser } from '@/lib/api/userService';

interface AvatarSelectPopupProps {
  avatar: string;
  setAvatar: (avatar: string) => void;
  closeSelectingAvatar: () => void;
}

export default function AvatarSelectPopup({ avatar, setAvatar, closeSelectingAvatar }: AvatarSelectPopupProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatar)
  const setProfile = useSetAtom(profileAtom)
  const profile = useAtomValue(profileAtom)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      closeSelectingAvatar();
    }
  };


  const submitNewAvatar = async () => {
    try {
      const { data, ok } = await updateUser({ picture: selectedAvatar, email: profile.email });
      if (ok) {
        setProfile((prev: any) => ({
          ...prev,
          picture: selectedAvatar
        }));
        setAvatar(selectedAvatar);
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      closeSelectingAvatar();
    }
  };

  return (
    <div className='absolute w-[100vw] h-[100vh] z-[220] bg-[black] bg-opacity-50 top-[-9.7vh] left-[-14.5vw]'>
      <div ref={popupRef} className="absolute w-[30vw] h-[60vh] bg-primary-skin rounded-2xl bottom-[15vh] right-[5vw] px-[2vw] py-[3vh]" style={avatar !== selectedAvatar ? { height: "60vh" } : {}}>
        <div className="flex justify-between">
          <p className='text-3xl 3xl:text-4xl 4xl:text-5xl'>Select your avatar</p>
          <CloseIcon className='text-4xl 3xl:text-5xl 4xl:text-6xl' onClick={closeSelectingAvatar} />
        </div>
        <div className='grid grid-cols-3 grid-rows-2 mt-[3vh] gap-4'>
          {avatarList.map((avatarItem: AvatarItem) => (
            <div
              key={avatarItem.id}
              className={`relative w-[13vh] h-[13vh] rounded-full border-primary-purple cursor-pointer transition-transform duration-200 ease-out hover:scale-105 will-change-transform ${
                avatarItem.path === selectedAvatar ? 'border-[3px]' : 'border-0'
              }`}
              onClick={() => setSelectedAvatar(avatarItem.path)}
            >
              <Image 
                src={avatarItem.path} 
                fill 
                alt={`Avatar ${avatarItem.id}`}
                className="rounded-full object-cover"
                quality={100}
                priority={true}
              />
            </div>
          ))}
        </div>
        {selectedAvatar !== avatar && (
          <div className='flex w-full justify-end mt-4'>
            <Button3 
              text='Save changes' 
              style={{ width: "9vw" }} 
              onClick={submitNewAvatar} 
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface AvatarItem {
  id: number;
  path: string;
  name: string;
}

const avatarList: AvatarItem[] = [
  { id: 1, path: "/profile/Settings/Avatar default.svg", name: "Default Avatar" },
  { id: 2, path: "/profile/Settings/Avatar 2.svg", name: "Avatar 2" },
  { id: 3, path: "/profile/Settings/Avatar 3.svg", name: "Avatar 3" },
  { id: 4, path: "/profile/Settings/Avatar 4.svg", name: "Avatar 4" },
  { id: 5, path: "/profile/Settings/Avatar 5.svg", name: "Avatar 5" },
  { id: 6, path: "/profile/Settings/Avatar 6.svg", name: "Avatar 6" },
  { id: 7, path: "/profile/Settings/Avatar 7.svg", name: "Avatar 7" },
  { id: 8, path: "/profile/Settings/Avatar container 8.svg", name: "Avatar 8" },
];
