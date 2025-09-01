import Button3 from '@/components/atoms/Button3'
import { IsNavOpenAtom, guestUser } from '@/utils/stores'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import BlurComp from '@/components/non_member/BlurComp'

export default function FirstLesson() {
	const isNavOpen = useAtomValue(IsNavOpenAtom)
	const guest_user = useAtomValue(guestUser)
	const [isOpen, setIsOpen] = useState(false)

	type EventDetails = {
		title: string
		description: string
		location: string
		startDate: string
		endDate: string
	}

	const handleAddToCalendar = ({
		title,
		description,
		location,
		startDate,
		endDate,
	}: EventDetails) => {
		const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
			title,
		)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
			description,
		)}&location=${encodeURIComponent(location)}&sf=true&output=xml`

		window.open(url, '_blank')
	}

	const handleDownloadICS = ({
		title,
		description,
		location,
		startDate,
		endDate,
	}: EventDetails) => {
		const domain = window.location.hostname || "TheDonovan'sPianoRoom"
		const uid = `${Date.now()}@${domain}`
		const CRLF = '\r\n'
		
		const icsContent =
			'BEGIN:VCALENDAR' + CRLF +
			'VERSION:2.0' + CRLF +
			`PRODID:-//${domain}//EN` + CRLF +
			'BEGIN:VEVENT' + CRLF +
			`UID:${uid}` + CRLF +
			`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z` + CRLF +
			`SUMMARY:${title}` + CRLF +
			`DESCRIPTION:${description}` + CRLF +
			`LOCATION:${location}` + CRLF +
			`DTSTART:${startDate}` + CRLF +
			`DTEND:${endDate}` + CRLF +
			'END:VEVENT' + CRLF +
			'END:VCALENDAR' + CRLF

		const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${title.replace(/\s+/g, '_')}.ics`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	const event = {
		title: 'Live lessons with The Donovan',
		description:
			'Live lessons with The Donovan: Join our next live session on March 18, at 2:00 pm EST.',
		location: "The Donovan's Piano Room",
		startDate: '20250318T180000Z',
		endDate: '20250318T190000Z',
	}

	const handleClickOutside = (e: React.FocusEvent<HTMLDivElement>) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setIsOpen(false)
		}
	}

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev)
	}

	return (
		<>
			<div
				className="relative h-[60vh] w-[100%] lg:w-[45vw]"
				style={isNavOpen ? { width: '38vw', height: '55vh' } : {}}
			>
				{guest_user && (
					<BlurComp section={'Home'} className={'mt-5 h-[95%] w-[100%]'} />
				)}
				<div className="absolute left-[10%] top-[10%] z-30 h-[90%] w-[80%]">
					<div className="mb-[3%] mt-[4%] flex select-none justify-between">
						<div className="flex items-center gap-[10%]">
							<span className="relative h-[3vh] w-[3vh]">
								<Image src="/dashboard/book-icon.svg" fill alt="" />
							</span>
							<Link href={{ pathname: '/lessons', query: { tab: 'live-sessions' } }}>
								<p className="text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl">
									Lessons
								</p>
							</Link>
						</div>
						<div className="flex items-center rounded-xl bg-[#FFEBD5] p-2">
							<span className="relative h-[2.3vh] w-[2.3vh]">
								<Image src="/dashboard/checkmark.svg" fill alt="" />
							</span>
							<p className="ml-3 text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl">
								Every Monday and Thursday
							</p>
						</div>
					</div>
					<iframe
						className="w-[100%] sm:h-[40%] md:h-[40%] lg:h-[47%]"
						src="https://www.youtube.com/embed/Mwt9f9H7dsE?si=D1HT7i873D3VgQ3B"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					></iframe>
					<p className="mb-[3%] mt-[4%] text-2xl font-semibold text-primary-brown">
						Live lessons with The Donovan
					</p>
					<div className="flex h-[10%] justify-between sm:text-lg md:text-xl lg:text-2xl 3xl:text-3xl 4xl:text-4xl">
						<div>
							<p className="">Join our next live session on</p>
							<p className="font-semibold">March 18, at 2:00 pm EST.</p>
						</div>
						
						<div
							className="relative inline-block text-left"
							style={{ width: '30%', height: '80%' }}
							onBlur={(e) => handleClickOutside(e)}
						>
							<Button3
								text={`Add to Calendar ${isOpen ? '▲' : '▼'}`}
								onClick={toggleDropdown}
							/>

							{isOpen && (
								<div className="absolute left-1/2 z-10 mt-1 w-11/12 -translate-x-1/2 divide-y divide-gray-100 rounded bg-primary-purple py-3">
									<ul className="text-center text-[12px] font-semibold text-white 3xl:text-2xl 4xl:text-3xl">
										<li>
											<Button3
												text='Google Calendar'
												onClick={() => {
													handleAddToCalendar(event)
													setIsOpen(false)
												}}
											/>
										</li>
										<li>
											<Button3
												text='Download ICS'
												onClick={() => {
													handleDownloadICS(event)
													setIsOpen(false)
												}}
											/>
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="relative h-[100%]">
					<Image
						src="/dashboard/lesson-bg.svg"
						fill
						alt=""
						className="h-[100%]"
					/>
				</div>
			</div>
		</>
	)
}
