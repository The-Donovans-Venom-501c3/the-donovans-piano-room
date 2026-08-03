'use client';

import Image from 'next/image';
import { Lesson } from './Lesson';

interface Props {
  lesson: Lesson;
  isSelected?: boolean;
  onClick: (lesson: Lesson) => void;
}

export default function LessonCard({ lesson, isSelected = false, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(lesson)}
      className={`group relative w-full rounded-[24px] p-5 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-[#EBDDFB] border-[#8C30E8]'
          : 'bg-white border-[#EADBF8] hover:border-[#D1A0FF] hover:bg-[#FAF3FF]'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-[16/9] rounded-[18px] overflow-hidden bg-purple-100">
        <Image
          src={lesson.thumbnailUrl}
          alt={lesson.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content with Increased Font Sizes */}
      <div className="mt-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#3B1559] line-clamp-1">
            {lesson.title}
          </h3>
          <p className="mt-2 text-sm md:text-base text-[#5A4F60] line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-5 pt-4 border-t border-[#E8DAF7] flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-semibold text-[#7A6E82]">
            <span>{lesson.duration}</span>
            <span>•</span>
            <span>{lesson.meta}</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#6F219E] group-hover:bg-[#591880] flex items-center justify-center transition-colors shadow-xs">
            <svg
              className="w-4 h-4 text-white translate-x-[0.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}