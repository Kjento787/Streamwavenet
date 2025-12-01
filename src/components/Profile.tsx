import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import type { Content, WatchHistory } from '../App';

type ProfileProps = {
  watchHistory: WatchHistory[];
  allContent: Content[];
  onBack: () => void;
  onPlayContent: (content: Content) => void;
};

export function Profile({ watchHistory, allContent, onBack, onPlayContent }: ProfileProps) {
  const sortedHistory = [...watchHistory].sort((a, b) => b.lastWatched - a.lastWatched);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your watch history?')) {
      localStorage.removeItem('streamwave_history');
      window.location.reload();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 px-4 py-2 rounded border border-red-600/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-32 px-8 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white text-5xl">
              U
            </div>
            <div>
              <h1 className="text-4xl text-white mb-2">Your Profile</h1>
              <p className="text-white/70">Manage your watch history and preferences</p>
            </div>
          </div>

          {/* Watch History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-white">Watch History</h2>
              <span className="text-white/50">{watchHistory.length} items</span>
            </div>

            {sortedHistory.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/50 text-xl">No watch history yet</p>
                <p className="text-white/30 mt-2">Start watching content to see your history here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedHistory.map((history) => {
                  const content = allContent.find((c) => c.id === history.contentId);
                  if (!content) return null;

                  const progress = (history.timestamp / content.duration) * 100;

                  return (
                    <div
                      key={history.contentId}
                      className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-4 hover:border-red-600/30 transition-all group cursor-pointer"
                      onClick={() => onPlayContent(content)}
                    >
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={content.thumbnail}
                            alt={content.title}
                            className="w-40 h-24 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white fill-current" />
                          </div>
                          {/* Progress overlay */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b">
                            <div
                              className="h-full bg-red-600 rounded-b"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-lg mb-2 group-hover:text-red-500 transition-colors">
                            {content.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mb-2">
                            <span className="px-2 py-0.5 border border-white/30 rounded">
                              {content.rating}
                            </span>
                            <span>{content.year}</span>
                            <span>•</span>
                            <span>{content.genre.join(', ')}</span>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/70">
                              Watched {formatDate(history.lastWatched)}
                            </span>
                            <span className="text-white/50">•</span>
                            {history.completed ? (
                              <span className="text-green-500">Completed</span>
                            ) : (
                              <span className="text-red-500">
                                Stopped at {formatTime(history.timestamp)} / {formatTime(content.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-6">
              <div className="text-red-500 text-3xl mb-2">
                {watchHistory.length}
              </div>
              <div className="text-white/70">Total Watched</div>
            </div>

            <div className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-6">
              <div className="text-red-500 text-3xl mb-2">
                {watchHistory.filter(h => h.completed).length}
              </div>
              <div className="text-white/70">Completed</div>
            </div>

            <div className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-6">
              <div className="text-red-500 text-3xl mb-2">
                {Math.floor(
                  watchHistory.reduce((acc, h) => {
                    const content = allContent.find(c => c.id === h.contentId);
                    return acc + (content ? h.timestamp / 3600 : 0);
                  }, 0)
                )}h
              </div>
              <div className="text-white/70">Hours Watched</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
