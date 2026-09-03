'use client';

import React, { useState, useRef } from 'react';

type Poetry = {
  id: string;
  title: string;
  type: string;
  stanzaSize?: number;
  date?: string;
  lines: string[];
};

function ScrollablePoetryContent({ poetry }: { poetry: Poetry }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const stanzaSize = poetry.stanzaSize ?? (poetry.type === 'NAZM' ? 0 : 2);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.pageY - (contentRef.current?.offsetTop || 0);
    scrollTop.current = contentRef.current?.scrollTop || 0;
  };

  const onMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !contentRef.current) return;
    e.preventDefault();
    const y = e.pageY - (contentRef.current.offsetTop || 0);
    const walk = (y - startY.current) * 1.5;
    contentRef.current.scrollTop = scrollTop.current - walk;
  };

  return (
    <div
      ref={contentRef}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeaveOrUp}
      onMouseUp={onMouseLeaveOrUp}
      onMouseMove={onMouseMove}
      className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="min-h-full w-full flex flex-col items-center justify-center">
        <table className="poetry-table">
          <tbody>
            {poetry.lines.map((line, index) => {
              const hasStanzaGap =
                stanzaSize > 0 &&
                (index + 1) % stanzaSize === 0 &&
                index !== poetry.lines.length - 1;

              return (
                <tr key={index}>
                  <td style={hasStanzaGap ? { paddingBottom: '1.5rem' } : undefined}>
                    {line}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



type Props = {
  data: Poetry[];
  tags: string[];
};

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/keyboard';

export default function PoetryFilter({ data, tags }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (poetry: Poetry) => {
    const stanzaSize = poetry.stanzaSize ?? (poetry.type === 'NAZM' ? 0 : 2);
    let formattedLines = "";
    
    poetry.lines.forEach((line, index) => {
      formattedLines += line;
      if (index !== poetry.lines.length - 1) {
        formattedLines += "\n";
        if (stanzaSize > 0 && (index + 1) % stanzaSize === 0) {
          formattedLines += "\n";
        }
      }
    });

    const text = `${poetry.title}\n\n${formattedLines}\n\nاسامہ گلزار`;
    navigator.clipboard.writeText(text);
    setCopiedId(poetry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredData = selectedTag
    ? data.filter((item) => item.type === selectedTag)
    : data;

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'GHAZAL': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'NAZM': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'QITA': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getUrduTagName = (tag: string) => {
    switch (tag) {
      case 'GHAZAL': return 'غزلیات';
      case 'NAZM': return 'نظمیں';
      case 'QITA': return 'قطعات';
      default: return tag;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center min-h-0 relative">
      {/* Top Bar */}
      <div className="w-full h-14 sm:h-16 bg-white dark:bg-[#1a1a1a] border-b border-[var(--border)] shadow-sm shrink-0 z-50 relative">
        <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-row items-center justify-between">
          
          <h1 className="urdu-title m-0 !text-[1.2rem] sm:!text-[1.3rem] text-[var(--foreground)] whitespace-nowrap shrink-0">
            کچھ اشعار اسامہ کے
          </h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-row items-center justify-end gap-3 w-max">
            {tags.length > 0 && (
              <>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`urdu-title px-4 py-1 rounded-full !text-[0.95rem] transition-colors ${
                    selectedTag === null
                      ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  تمام
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`urdu-title px-4 py-1 rounded-full !text-[0.95rem] transition-colors ${
                      selectedTag === tag
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {getUrduTagName(tag)}
                  </button>
                ))}
              </>
            )}

            <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
            
            <a 
              href="https://pay.usamagulzar.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="urdu-title !text-[0.95rem] px-4 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              ایک کپ چائے
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -me-2 text-[var(--foreground)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white dark:bg-[#1a1a1a] border-b border-[var(--border)] shadow-lg z-40 flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
          {tags.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2">
              <button
                onClick={() => { setSelectedTag(null); setIsMobileMenuOpen(false); }}
                className={`urdu-title px-4 py-1 rounded-full !text-[0.95rem] transition-colors ${
                  selectedTag === null
                    ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                تمام
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSelectedTag(tag); setIsMobileMenuOpen(false); }}
                  className={`urdu-title px-4 py-1 rounded-full !text-[0.95rem] transition-colors ${
                    selectedTag === tag
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {getUrduTagName(tag)}
                </button>
              ))}
            </div>
          )}
          
          <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-800"></div>
          
          <a 
            href="https://pay.usamagulzar.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="urdu-title w-full justify-center px-4 py-1.5 rounded-xl !text-base bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-2"
          >
            ایک کپ چائے
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </a>
        </div>
      )}

      {/* Poetry Feed */}
      <div className="w-full flex-1 min-h-0 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            dir="rtl"
            navigation={true}
            keyboard={{
              enabled: true,
              onlyInViewport: false,
            }}
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Navigation, Keyboard]}
            className="w-full h-full"
          >
            {filteredData.map((poetry) => (
              <SwiperSlide key={poetry.id} className="w-[85%] sm:w-[75%] max-w-lg">
                <article
                  className="w-full bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-[var(--border)] h-auto max-h-[95%] flex flex-col overflow-hidden"
                >
                  {/* Blue Header */}
                  <div className="text-center shrink-0 bg-[var(--primary)] text-white py-2 px-4 shadow-sm z-10">
                    <h2 className="urdu-title !text-base sm:!text-lg m-0 leading-tight">{poetry.title}</h2>
                  </div>

                  {/* Poetry Content */}
                  <ScrollablePoetryContent poetry={poetry} />

                  {/* Gray Footer */}
                  <div className="relative shrink-0 bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 py-1.5 px-4 border-t border-[var(--border)] flex items-center justify-center">
                    <span className="urdu-title !text-xs sm:!text-sm">اسامہ گلزار</span>
                    
                    <button
                      onClick={() => handleCopy(poetry)}
                      className="absolute left-4 p-1.5 text-gray-400 hover:text-[var(--primary)] transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Copy Poetry"
                    >
                      {copiedId === poetry.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      )}
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center text-[var(--muted)] py-12 absolute inset-0 flex items-center justify-center">
            No poetry found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
