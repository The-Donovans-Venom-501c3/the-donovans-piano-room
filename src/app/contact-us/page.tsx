"use client";
import ContactUsContentWrapper from "@/components/ContentWrappers/contact-us/contact-us-wrapper";
import ContactUsForm from "./components/ContactUsForm";
import Footer3 from "@/components/footers/Footer3";
import Navbar1 from "@/components/navbars/Navbar6";

export default function SignUp() {
  return (
    <>
      <Navbar1 page="contact" />
      <ContactUsContentWrapper>
        <ContactUsForm />
      </ContactUsContentWrapper>
      <Footer3 />
    </>
  );
}
