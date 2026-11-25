import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import PaymentHistory from "@/components/payment/PaymentHistory";
import { authorizedWrapperTitles, settingsNavigation } from "@/utils/general";
import "@/styles/primary-purple-scrollbar.css";

export default function PaymentHistoryPage() {
  return (
    <AuthorizedWrapper1
      pageTitle={authorizedWrapperTitles.AccountAndSettings}
      openedLink=""
    >
      <div className="h-full overflow-y-auto primary-purple-scrollbar pb-12 bg-[#FFF8F3]">
        <AccountAndSettingsNav currentPage={settingsNavigation.paymentHistory} />

        <div className="w-full max-w-[1112px] mx-auto px-4 sm:px-6 mt-8">
          <PaymentHistory />
        </div>
      </div>
    </AuthorizedWrapper1>
  );
}