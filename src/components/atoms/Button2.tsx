export default function Button2({text, onClick=null, style={}}: {text: string, onClick?: any, style?: any}) {
  return (
    <button onClick={onClick} style={style} className="w-full border border-primary-yellow active:bg-[#FAF5C7] py-3 2xl:py-4 rounded-full text-[12px] 2xl:text-2xl 4xl:text-3xl font-semibold text-[#F1D454]">{text}</button>
  )
}

