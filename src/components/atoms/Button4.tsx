export default function Button4({text, onClick=null, style={}}: {text: string, onClick?: any, style?: any}) {
    return (
        <button onClick={onClick} className={' w-full text-center rounded-full text-[12px] 3xl:text-2xl 4xl:text-3xl text-primary-purple border border-primary-purple hover:bg-[#FBF5FF] font-semibold 2xl:py-4 3xl:py-5 2xl:rounded-full flex items-center justify-center'} type='submit' style={style}><p>{text}</p></button>
    )
}