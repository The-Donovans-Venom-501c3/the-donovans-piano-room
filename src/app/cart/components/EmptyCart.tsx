import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";

export default function EmptyCart() {
  return (
    <div className="flex h-[40vh] w-full flex-col items-center justify-center rounded-xl bg-[#ffffff] space-y-3">
      <div>
        <ShoppingCartOutlined className="text-6xl text-[#E98427] 3xl:text-7xl 4xl:text-8xl" />
      </div>
      <h3 className=" text-center font-montserrat text-4xl font-semibold text-primary-brown 3xl:text-5xl 4xl:text-6xl">
        Your shopping cart is currently empty
      </h3>
      <p className=" text-xl 3xl:text-2xl 4xl:text-3xl">
        Go back to the bookstore and start shopping
      </p>
      <button className=" rounded-3xl bg-[#6F219E] px-14 py-2 text-[15px] font-semibold text-white">
        Start shopping
      </button>
    </div>
  );
}
