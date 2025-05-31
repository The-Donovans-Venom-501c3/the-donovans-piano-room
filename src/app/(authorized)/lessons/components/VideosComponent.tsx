import React from 'react'
import LessonCard from './LessonCard';
import { Lesson, lessons } from './Lesson';

interface Props {
  onSelectVideo: (video: Lesson) => void;
}
export default function VideosComponent({ onSelectVideo }: Props) {

  return (
    <><h2 className="text-4xl font-medium text-primary-brown mb-4">
      Videos(32)
    </h2>
      <hr className="border-[1px] border-purple-200" />
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 overflow-y-auto overflow-x-hidden w-full">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onClick={onSelectVideo} />
        ))}
      </div>
    </>
  )
}
