export default function Button4({text, onClick=null, style={}}: {text: string, onClick?: any, style?: any}) {
    return (
        <button onClick={onClick} className={' w-full text-center py-3 rounded-full text-[12px] 3xl:text-2xl 4xl:text-3xl text-primary-purple border border-primary-purple font-semibold 2xl:py-4 3xl:py-5 2xl:rounded-full'} type='submit' style={style}>{text}</button>
    )
}