'use client';

import { useState, useEffect } from 'react';
import LessonCard from './LessonCard';
import { Lesson } from './Lesson';

interface VideosComponentProps {
  lessons: Lesson[];
  searchQuery: string;
  onSelectLesson: (lesson: Lesson) => void;
  watchedLessonIds?: string[]; // Optional prop if passed from parent/database
}

export default function VideosComponent({
  lessons,
  searchQuery,
  onSelectLesson,
  watchedLessonIds = [],
}: VideosComponentProps) {
  const [watchedIds, setWatchedIds] = useState<string[]>(watchedLessonIds);

  // Load from localStorage if no backend prop provided
  useEffect(() => {
    if (watchedLessonIds.length > 0) {
      setWatchedIds(watchedLessonIds);
    } else {
      const saved = localStorage.getItem('watchedLessons');
      if (saved) {
        try {
          setWatchedIds(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse watched lessons', e);
        }
      }
    }
  }, [watchedLessonIds]);

  const q = (searchQuery || '').toLowerCase().trim();

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
              isWatched={watchedIds.includes(lesson.id)} // <-- PASS IS WATCHED HERE
              onClick={() => onSelectLesson(lesson)}
            />
          ))}
        </div>
      )}
    </div>
  );
}