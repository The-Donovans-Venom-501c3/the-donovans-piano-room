import { useState } from "react"

export default function AllOrUnread({unreadsNumber}:{unreadsNumber: number}) {
    const [allOrUnread, setAllOrUnread] = useState("all")
  return (
    <div className="flex w-[80%] mt-[2vh] text-center text-2xl 3xl:text-3xl 4xl:text-4xl font-medium text-primary-brown">
        <span
            onClick={()=>{
                setAllOrUnread("all")
            }}
            className="w-[50%] p-[1.5vh] rounded-l-2xl border-r border-2 border-white"
            style={allOrUnread === "all" ?
                {backgroundColor: "#D8BCFD"} :
                {boxShadow: "inset 0px 5px 7px #FBDAC1"}}
            >All</span>
        <span
            onClick={()=>{
                setAllOrUnread("unread")
            }}
            className="w-[50%] p-[1.5vh] rounded-r-2xl border-2 border-l border-white"
            style={allOrUnread === "unread" ?
                {backgroundColor: "#D8BCFD"} :
                {boxShadow: "inset 0px 5px 7px #FBDAC1"}}
            >Unread {"("+unreadsNumber+")"}</span>
    </div>
  )
}
