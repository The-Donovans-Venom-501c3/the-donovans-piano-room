export default function Button2({
  text,
  className,
  onClick = null,
  style = {},
  disable,
}: {
  text: React.ReactNode;
  className?: string;
  onClick?: any;
  style?: any;
  disable?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disable}
      style={style}
      className={`${className} w-full cursor-pointer rounded-full border border-primary-yellow py-3 text-[12px] font-semibold text-[#F1D454] active:bg-[#FAF5C7] 2xl:py-4 2xl:text-2xl 4xl:text-3xl`}
    >
      {text}
    </button>
  );
}
