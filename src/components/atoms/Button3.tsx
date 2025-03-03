'use client'
export default function Button3({text, onClick=null, style={}}: {text: string, onClick?: any, style?: any}) {
    return (
        <button onClick={onClick} className={' w-full text-center bg-primary-purple hover:bg-[#601D86] py-3 rounded-full text-[12px] 3xl:text-2xl 4xl:text-3xl text-white font-semibold 2xl:py-4 3xl:py-5'} type='submit' style={style}>{text}</button>
    )
}





