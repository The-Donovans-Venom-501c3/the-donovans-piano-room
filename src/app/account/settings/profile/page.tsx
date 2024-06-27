"use client"
import AccountWrapper from "@/components/ContentWrappers/account/AccountWrapper";
import { settingsNavigation } from "@/utils/general";

export default function page() {
  return (
    <AccountWrapper currentPage={settingsNavigation.profile}>
    <div>
    </div>

    </AccountWrapper>
  )
}
