'use client';

import LessonCard from './LessonCard';
import { Lesson } from './Lesson';

interface VideosComponentProps {
  lessons: Lesson[];
  searchQuery: string;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function VideosComponent({
  lessons,
  searchQuery,
  onSelectLesson,
}: VideosComponentProps) {
  const q = (searchQuery || '').toLowerCase().trim();

  // Safe optional-chaining search filter
  const filtered = lessons.filter((lesson) => {
    if (!q) return true;
    const titleMatch = lesson.title?.toLowerCase().includes(q) ?? false;
    const descMatch = lesson.description?.toLowerCase().includes(q) ?? false;
    return titleMatch || descMatch;
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-4">
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium text-lg">
          No videos found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => onSelectLesson(lesson)}
            />
          ))}
        </div>
      )}
    </div>
  );
}