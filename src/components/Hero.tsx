import { Play, Info } from 'lucide-react';
import type { Content } from '../App';

type HeroProps = {
  content?: Content;
  onPlay: () => void;
};

export function Hero({ content, onPlay }: HeroProps) {
  if (!content) return null;

  return (
    <div className="relative h-[90vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={content.backdrop}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-8 md:px-16">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block px-4 py-1 bg-red-600/90 backdrop-blur-sm text-white rounded">
            Featured
          </div>
          
          <h1 className="text-6xl md:text-7xl text-white tracking-tight">
            {content.title}
          </h1>
          
          <div className="flex items-center gap-4 text-white/80">
            <span className="px-2 py-1 border border-white/40 rounded text-sm">{content.rating}</span>
            <span>{content.year}</span>
            <span>•</span>
            <span>{Math.floor(content.duration / 60)} min</span>
            <span>•</span>
            <div className="flex gap-2">
              {content.genre.slice(0, 3).map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </div>

          <p className="text-white/90 text-lg max-w-xl leading-relaxed">
            {content.description}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={onPlay}
              className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded transition-all transform hover:scale-105"
            >
              <Play className="w-6 h-6 fill-current" />
              <span className="text-lg">Play Now</span>
            </button>
            
            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded transition-all border border-white/20">
              <Info className="w-6 h-6" />
              <span className="text-lg">More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
