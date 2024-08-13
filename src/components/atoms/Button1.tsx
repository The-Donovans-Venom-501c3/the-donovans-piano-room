export default function Button1({text, onClick=null, style={}, disable=false}: {text: string, onClick?: any, style?: any, disable?: boolean}) {
    return (
        <button onClick={onClick} style={style} disabled={disable} className='w-full text-center bg-[#F0D454] hover:bg-[#E9BB18] active:bg-[#DAA718]  py-3 rounded-full text-[12px] 2xl:text-2xl 4xl:text-3xl text-primary-purple font-bold 2xl:py-4 3xl:py-5 2xl:rounded-full' type='submit'>{text}</button>
    )
}