"use client"
import AccountWrapper from "@/components/ContentWrappers/account/AccountWrapper";
import { settingsNavigation } from "@/utils/general";
import AccountForm from "./components/AccountForm"
export default function page() {
  return (
    <AccountWrapper currentPage={settingsNavigation.profile}>
      <div className="flex w-full">
        <AccountForm />
      </div>
    </AccountWrapper>
  )
}
