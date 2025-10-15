export default function Button1({
  text,
  onClick,
  style = {},
  type = "submit",
  disabled = false,
}: {
  text: string;
  type?: "submit" | "reset" | "button";
  onClick?: (e: any) => any | null;
  style?: any;
  disabled?: boolean;
}) {
  return disabled ? (
    <button
      onClick={onClick}
      style={style}
      disabled={disabled}
      className="w-full rounded-full bg-tertiary-yellow py-3 text-center text-[12px] font-bold text-primary-purple 2xl:rounded-full 2xl:py-4 2xl:text-2xl 3xl:py-5 4xl:text-3xl"
      type={type}
    >
      {text}
    </button>
  ) : (
    <button
      onClick={onClick}
      style={style}
      disabled={disabled}
      className="w-full rounded-full bg-[#F0D454] py-3 text-center  text-[12px] font-bold text-primary-purple hover:bg-[#E9BB18] active:bg-[#DAA718] 2xl:rounded-full 2xl:py-4 2xl:text-2xl 3xl:py-5 4xl:text-3xl"
      type={type}
    >
      {text}
    </button>
  );
}
