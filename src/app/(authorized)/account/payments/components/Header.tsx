export default function Header() {
  return (
    <>
      <h1 className="mt-[3vh] font-montserrat text-5xl font-medium text-primary-brown 3xl:text-6xl 4xl:text-7xl">
        Manage payment methods
      </h1>
      <p className="w-[90%] text-2xl text-primary-gray 3xl:text-3xl 4xl:text-4xl">
        Select a payment method to update, or add a new one to your account.
      </p>
      <div className="mb-6 mt-6 border-t border-[#E5CBA8]" />
    </>
  );
}