export default function Button2({text, onClick=null}: {text: string, onClick?: any}) {
  return (
    <button onClick={onClick} className="w-full border border-primary-yellow py-3 2xl:py-4 rounded-full text-[12px] 2xl:text-2xl 4xl:text-3xl font-semibold text-primary-yellow">{text}</button>
  )
}
