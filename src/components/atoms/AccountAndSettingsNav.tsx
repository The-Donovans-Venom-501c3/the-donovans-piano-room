import { settingsNavigation } from "@/utils/general";
import Link from "next/link";

export default function AccountAndSettingsNav({currentPage}: {currentPage: string}) {
  return (
    <div className="bg-primary-skin w-full p-[1.5vh] mt-[3vh] rounded-xl flex gap-[2vw] relative z-30">
        <Link href="/account/settings/profile">
          <p className="text-primary-gray text-xl py-[.5vh] px-[1vw] rounded-xl ml-[3vh]"
            style={currentPage === settingsNavigation.profile ? {background: "#D8BCFD", fontWeight: "600", color: "#6F219E"} : {}}
          >Profile</p>
        </Link>
        <Link href="">
          <p className="text-primary-gray text-xl py-[.5vh] px-[1vw] rounded-xl"
          style={currentPage === settingsNavigation.membership ? {background: "#D8BCFD", fontWeight: "600", color: "#6F219E"} : {}}
          >Membership</p>
        </Link>
        <Link href="">
          <p className="text-primary-gray text-xl py-[.5vh] px-[1vw] rounded-xl"
          style={currentPage === settingsNavigation.paymentMethods ? {background: "#D8BCFD", fontWeight: "600", color: "#6F219E"} : {}}
          >Payment methods</p>
        </Link>
        <Link href="">
          <p className="text-primary-gray text-xl py-[.5vh] px-[1vw] rounded-xl"
          style={currentPage === settingsNavigation.notification ? {background: "#D8BCFD", fontWeight: "600", color: "#6F219E"} : {}}
          >Notifications</p>
        </Link>
        <Link href="">
          <p className="text-primary-gray text-xl py-[.5vh] px-[1vw] rounded-xl"
          style={currentPage === settingsNavigation.timeSpent ? {background: "#D8BCFD", fontWeight: "600", color: "#6F219E"} : {}}
          >Time spent</p>
        </Link>
    </div>
  )
}
