"use client"
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import { authorizedWrapperTitles, beenTimeAgo, dummyNoticationsData, profile, settingsNavigation } from "@/utils/general";
import { profileAtom } from "@/utils/stores";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import AllOrUnread from "./components/AllOrUnread";
import AllCatchUp from "./components/AllCatchUp";
import { notification } from "./components/notificationInterface";
import NotificationItem from "./components/NotificationItem";
import "./page.css"

export default function Page() {
    const [allNotifications, setAllNotifications] = useState<{todays: notification[], past: notification[]}>({todays: [], past: []})
    const [displayedNotifications, setDisplayedNotifications] = useState<{todays: notification[], past: notification[]}>({todays: [], past: []})
    const [unreadsNumber, setUnreadsNumber] = useState(0)
    const setProfile = useSetAtom(profileAtom)
    const initNotifications = (notifications: notification[]) => {

      const todays = []
      const past = []
      let unreadsNumber = 0
      for(let item of notifications){
        const {timeAgo, underADay} = beenTimeAgo(item.date)
        if(item.unread) { unreadsNumber += 1}
        if (underADay){
          todays.push({...item, timeAgo})
        } else {
          past.push({...item, timeAgo})
        }
      }
      setUnreadsNumber(unreadsNumber)
      setAllNotifications({ todays, past })
      setDisplayedNotifications({ todays, past })
    }
    const displayAll = () => {
      setDisplayedNotifications(allNotifications)
    }
    const filterUnreads = () => {
      const temp =
        allNotifications.past.length > allNotifications.todays.length
        ? allNotifications.past : allNotifications.todays
      const todays = []
      const past = []
      for(let i in temp){
        const todaysN = allNotifications.todays[i]
        const pastN = allNotifications.past[i]
        if (todaysN && todaysN.unread){
            todays.push(todaysN)
        }
        if (pastN && pastN.unread){
          past.push(pastN)
      }
      }
      setDisplayedNotifications({ todays, past })
    }
    useEffect(()=>{
        setProfile(profile)
        initNotifications(dummyNoticationsData)
    }, [])
  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings} openedLink="">
        <AccountAndSettingsNav currentPage={settingsNavigation.notification}/>
        <div className="overflow-y-auto relative h-[88%] w-[85vw]">
          <div className="w-[60%] h-full mt-[1%]">
              <h2 className="text-5xl 3xl:text-6xl 4xl:text-7xl text-primary-brown font-montserrat font-medium mt-[3vh]">Notifications</h2>
              <AllOrUnread unreadsNumber={unreadsNumber} />
              {/* <AllCatchUp /> */}

            {!!displayedNotifications.todays.length && (
              <>
                  <h5 className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">Today {"("+displayedNotifications.todays.length+")"}</h5>
                  {displayedNotifications.todays.map((item, i) =>(
                    <NotificationItem item={item} key={i}/>
                  ))}
                </>
            )}
            {!!displayedNotifications.past.length && (
              <>
                  <h5 className="text-primary-brown text-2xl 3xl:text-3xl 4xl:text-4xl font-medium mt-[2%]">Past notifications {"("+displayedNotifications.past.length+")"}</h5>
                  {displayedNotifications.past.map((item, i) =>(
                    <NotificationItem item={item} key={i}/>
                  ))}
                </>
            )}
          </div>
        </div>
    </AuthorizedWrapper1>
  )
}
