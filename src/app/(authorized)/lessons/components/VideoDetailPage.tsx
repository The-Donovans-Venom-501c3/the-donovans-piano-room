'use client'
import { Lesson } from './Lesson'

interface VideoDetailProps {
  lesson: Lesson
  prevLesson: Lesson | null
  nextLesson: Lesson | null
  onBack: () => void
  onPrev: () => void
  onNext: () => void
}

export default function VideoDetail({ lesson, prevLesson, nextLesson, onBack, onPrev, onNext }: VideoDetailProps) {
  return (
    <div className="bg-transparent text-[#3F3B3C] h-full">
      <div className=" mx-auto py-8 ">
        {/* ─── Top nav ─────────────────────────────────────────────── */}
        <div className="flex flex-row justify-between text-purple-700 text-3xl font-large mb-4">
        <button
          onClick={onBack}
          className=" justify-item-start hover:text-purple-800 font-semibold"
        >
          ← All videos
        </button>
          <div className=" flex space-x-4">
              {prevLesson && (
                <button  onClick={onPrev}>
                    <img src='/lessons/Videos/Left Chevron Arrow.svg'/>
                </button>
             )}
              <span className="text-[#3F3B3C] mt-2 " >{lesson.title}</span>
              {nextLesson && (
                <button onClick={onNext}>
                  <img src='/lessons/Videos/Right Chevron Arrow.svg'/>
                </button>
              )}
          </div>
          <div>{/* space for adding transcript function*/}</div>
          </div>

        <hr className="mt-4 border-[1px] border-purple-200" />
        
        {/* ─── Lesson Frame ─────────────────────────────────────────────── */}
        <div className='flex flex-row justify-between'>
            <div></div>
            <div className=" aspect-video h-[578px] rounded-xl overflow-hidden shadow mt-4">
            <iframe
                src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                allowFullScreen
                className="w-full h-full object-center"
                title={lesson.title}
            />
            </div>
            <div></div>
        </div>
        </div>
      </div>
  )
}