import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, Info, Plus } from 'lucide-react';
import type { Content, WatchHistory } from '../App';

type ContentRowProps = {
  title: string;
  content: Content[];
  onPlayContent: (content: Content) => void;
  watchHistory: WatchHistory[];
};

export function ContentRow({ title, content, onPlayContent, watchHistory }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  if (content.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });

      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeft(scrollRef.current.scrollLeft > 0);
          setShowRight(
            scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
          );
        }
      }, 300);
    }
  };

  const getProgress = (contentId: string) => {
    const history = watchHistory.find(h => h.contentId === contentId);
    if (!history) return 0;
    const content_item = content.find(c => c.id === contentId);
    if (!content_item) return 0;
    return (history.timestamp / content_item.duration) * 100;
  };

  return (
    <div className="px-8 md:px-16 mb-12 group/row">
      <h2 className="text-2xl text-white mb-4">{title}</h2>
      
      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onPlay={onPlayContent}
              progress={getProgress(item.id)}
            />
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
          </button>
        )}
      </div>
    </div>
  );
}

type ContentCardProps = {
  content: Content;
  onPlay: (content: Content) => void;
  progress: number;
};

function ContentCard({ content, onPlay, progress }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(content);
  };

  return (
    <div
      className="flex-shrink-0 w-72 group/card cursor-pointer relative transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        zIndex: isHovered ? 50 : 0,
      }}
    >
      <div className="relative overflow-visible rounded-md">
        <div className={`relative overflow-hidden rounded-md shadow-2xl transition-all duration-500 ${
          isHovered ? 'shadow-black' : ''
        }`}>
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-full aspect-[16/9] object-cover"
          />
          
          {/* Progress bar - only show when not hovering */}
          {progress > 0 && !isHovered && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
              <div
                className="h-full bg-red-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-all duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1" />
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all"
                  title="Add to list"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-white text-lg leading-tight line-clamp-2">{content.title}</h3>

                {progress > 0 && (
                  <div className="relative h-1 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-white/90">
                  <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-white">{content.rating}</span>
                  <span>{content.year}</span>
                  <span>•</span>
                  <span>{Math.floor(content.duration / 60)}m</span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs text-white/80">
                  {content.genre.slice(0, 3).map((genre, idx) => (
                    <span key={genre}>
                      {genre}{idx < Math.min(2, content.genre.length - 1) && ' •'}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={handlePlayClick}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black px-6 py-2.5 rounded-md transition-all hover:scale-105 flex-1 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span className="font-semibold">Play</span>
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700 flex items-center justify-center hover:scale-110 transition-all"
                    title="More info"
                  >
                    <Info className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}