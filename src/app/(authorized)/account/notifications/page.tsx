"use client"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, beenTimeAgo, dummyNoticationsData, profile, settingsNavigation } from "@/utils/general";
import { hasUnreadAtom, IsNavOpenAtom, profileAtom } from "@/utils/stores";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import AllOrUnread from "./components/AllOrUnread";
import AllCatchUp from "./components/AllCatchUp";
import { notification } from "./components/notificationInterface";
import NotificationItem from "./components/NotificationItem";
import "./page.css"

export default function Page() {
    const [allNotifications, setAllNotifications] = useState<[notification[], notification[]]>([[],[]])
    const [displayedNotifications, setDisplayedNotifications] = useState<[notification[], notification[]]>([[],[]])
    const [unreadsNumber, setUnreadsNumber] = useState(0)
    const isNavOpen = useAtomValue(IsNavOpenAtom)
    const setHasUnread = useSetAtom(hasUnreadAtom)
    const setProfile = useSetAtom(profileAtom)
    const initNotifications = (notifications: notification[]) => {
    
      const todays = []
      const past = []
      let unreadsNumber = 0
      for(let item of notifications){
        const {timeAgo, underADay} = beenTimeAgo(item.date)
        console.log(item, underADay)
        if(item.unread) { unreadsNumber += 1}
        if (underADay){
          todays.push({...item, timeAgo, mainIndex: todays.length})
        } else {
          past.push({...item, timeAgo, mainIndex: past.length})
        }
      }
      if(unreadsNumber){ setHasUnread(true) }
      setUnreadsNumber(unreadsNumber)
      setAllNotifications([todays, past])
      setDisplayedNotifications([todays, past])
    }
    const displayAll = () => {
      setDisplayedNotifications(allNotifications)
    }
    const filterUnreads = () => {
      const temp =
        allNotifications[1].length > allNotifications[0].length
        ? allNotifications[1] : allNotifications[0]
      const todays = []
      const past = []
      for(let i in temp){
        const todaysN = allNotifications[0][i]
        const pastN = allNotifications[1][i]
        if (todaysN && todaysN.unread){
            todays.push(todaysN)
        }
        if (pastN && pastN.unread){
          past.push(pastN)
      }
      }
      setDisplayedNotifications([todays, past])
    }
    useEffect(()=>{
        setProfile(profile)
        initNotifications(dummyNoticationsData)
    }, [])
    const deleteItem = (index: number, section: number) => {
      let temp: [notification[], notification[]] = [...displayedNotifications]
      if(temp[section][index].unread){ setUnreadsNumber(prev => prev-=1)}
      temp[section].splice(index, 1)
      setDisplayedNotifications(temp)
    }
    const setItemToRead = (index: number, section: number) => {
      let temp: [notification[], notification[]] = [...displayedNotifications]
      if(temp[section][index].unread){ setUnreadsNumber(prev => prev-=1)}
      temp[section][index].unread = false
      setDisplayedNotifications(temp)
      
    }

  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings} openedLink="">
        <AccountAndSettingsNav currentPage={settingsNavigation.notification}/>
        <div className="overflow-y-auto relative h-[88%]" style={{width: isNavOpen ? "76.6vw" :"85vw"}}>
          <div className="w-[60%] h-full mt-[1%]">
              <h2 className="text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]">Notifications</h2>
              <AllOrUnread unreadsNumber={unreadsNumber} displayAll={displayAll} filterUnreads={filterUnreads} />
              {/* <AllCatchUp /> */}

            {!!displayedNotifications[0].length && (
              <>
                  <h5 className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">Today {"("+displayedNotifications[0].length+")"}</h5>
                  {displayedNotifications[0].map((item, i) =>(
                    <NotificationItem item={item} key={i} deleteItem={() => deleteItem(i, 0)} itemIsRead={() => setItemToRead(i, 0)} />
                  ))}
              </>
            )}
            {!!displayedNotifications[1].length && (
              <>
                  <h5 className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">Past notifications {"("+displayedNotifications[1].length+")"}</h5>
                  {displayedNotifications[1].map((item, i) =>(
                    <NotificationItem item={item} key={i} deleteItem={ () => deleteItem(i, 1)} itemIsRead={() => setItemToRead(i, 1)} />
                  ))}
              </>
            )}
            {!displayedNotifications[0].length && !displayedNotifications[1].length && (
              <AllCatchUp/>
            )}
          </div>
        </div>
    </AuthorizedWrapper1>
  )
}
