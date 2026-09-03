import React from 'react';
import poetryData from '../data/poetry.json';
import PoetryFilter from './PoetryFilter';

export default function Home() {
  // Extract unique tags that actually have poetry
  const uniqueTags = Array.from(new Set(poetryData.map((item) => item.type))).filter(Boolean);

  return (
    <main className="flex-1 flex flex-col items-center min-h-0 w-full pt-0">
      {/* Main Content with Client-Side Filtering */}
      <PoetryFilter data={poetryData} tags={uniqueTags} />
    </main>
  );
}
