export default function Button4({
  text,
  onClick = null,
  style = {},
  disabled = false,
}: {
  text: string;
  onClick?: any;
  style?: any;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        " flex w-full items-center justify-center rounded-full border border-primary-purple text-center text-[12px] font-semibold text-primary-purple hover:bg-[#FBF5FF] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent 2xl:rounded-full 2xl:py-4 3xl:py-5 3xl:text-2xl 4xl:text-3xl"
      }
      type="submit"
      style={style}
    >
      <p>{text}</p>
    </button>
  );
}
