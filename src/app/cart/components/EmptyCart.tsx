import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";

export default function EmptyCart() {
  return (
    <div className="flex h-[40vh] w-full flex-col items-center justify-center rounded-xl bg-[#ffffff]">
        <div><ShoppingCartOutlined className="text-[#E98427] text-6xl 3xl:text-7xl 4xl:text-8xl" /></div>
        <h3 className="text-center font-montserrat text-4xl 3xl:text-5xl 4xl:text-6xl font-semibold text-primary-brown my-[.5%]">Your shopping cart is currently empty</h3>
        <p className="text-xl 3xl:text-2xl 4xl:text-3xl mt-">Go back to the bookstore and start shopping </p>
    </div>
  )
}
