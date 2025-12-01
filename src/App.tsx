import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContentRow } from './components/ContentRow';
import { VideoPlayer } from './components/VideoPlayer';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { mockMovies, mockTVSeries, mockKDrama, mockAnime, mockDocumentaries, mockAction, mockComedy, mockHorror } from './data/mockContent';
import { fetchAllContent } from './services/movieApi';

export type Content = {
  id: string;
  title: string;
  thumbnail: string;
  backdrop: string;
  description: string;
  duration: number;
  year: number;
  rating: string;
  genre: string[];
  videoUrl: string;
  type: 'movie' | 'series' | 'kdrama' | 'anime' | 'documentary';
};

export type WatchHistory = {
  contentId: string;
  timestamp: number;
  lastWatched: number;
  completed: boolean;
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'player' | 'profile' | 'admin'>('home');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    // Load watch history from localStorage
    const savedHistory = localStorage.getItem('streamwave_history');
    if (savedHistory) {
      setWatchHistory(JSON.parse(savedHistory));
    }

    // Load and initialize content
    initializeContent();
  }, []);

  const initializeContent = async () => {
    setIsLoadingContent(true);
    
    // Load custom content from localStorage
    const savedContent = localStorage.getItem('streamwave_content');
    if (savedContent) {
      setAllContent(JSON.parse(savedContent));
    } else {
      // Fetch from API and merge with mock content
      const apiContent = await fetchAllContent();
      const initialContent = [
        ...apiContent,
        ...mockMovies,
        ...mockTVSeries,
        ...mockKDrama,
        ...mockAnime,
        ...mockDocumentaries,
        ...mockAction,
        ...mockComedy,
        ...mockHorror,
      ];
      
      // Remove duplicates by ID
      const uniqueContent = Array.from(
        new Map(initialContent.map(item => [item.id, item])).values()
      );
      
      setAllContent(uniqueContent);
      localStorage.setItem('streamwave_content', JSON.stringify(uniqueContent));
    }
    
    setIsLoadingContent(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePlayContent = (content: Content) => {
    setSelectedContent(content);
    // Open video player in new window
    const playerUrl = `/player?id=${content.id}`;
    window.open(playerUrl, '_blank', 'width=1280,height=720');
  };

  const handleUpdateProgress = (contentId: string, timestamp: number, duration: number) => {
    const newHistory = [...watchHistory];
    const existingIndex = newHistory.findIndex(h => h.contentId === contentId);
    
    const historyItem: WatchHistory = {
      contentId,
      timestamp,
      lastWatched: Date.now(),
      completed: timestamp / duration > 0.9,
    };

    if (existingIndex >= 0) {
      newHistory[existingIndex] = historyItem;
    } else {
      newHistory.push(historyItem);
    }

    setWatchHistory(newHistory);
    localStorage.setItem('streamwave_history', JSON.stringify(newHistory));
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedContent(null);
  };

  const handleAdminLogin = (email: string, password: string) => {
    // Check if admin email and password
    if (email === 'kjento.mertes@gmail.com' && password === 'Kjentocaje3') {
      setIsAdmin(true);
      setCurrentView('admin');
    }
  };

  const handleAddContent = (content: Content) => {
    const newContent = [...allContent, content];
    setAllContent(newContent);
    localStorage.setItem('streamwave_content', JSON.stringify(newContent));
  };

  const handleDeleteContent = (contentId: string) => {
    const newContent = allContent.filter(c => c.id !== contentId);
    setAllContent(newContent);
    localStorage.setItem('streamwave_content', JSON.stringify(newContent));
  };

  // Filter content based on search
  const getFilteredContent = (content: Content[]) => {
    if (!searchQuery.trim()) return content;
    
    return content.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Categorize content with search filtering
  const trendingMovies = getFilteredContent(
    allContent.filter(c => c.type === 'movie' && c.id.startsWith('trend-'))
  );
  const movies = getFilteredContent(
    allContent.filter(c => c.type === 'movie' && !c.id.startsWith('trend-'))
  );
  const tvSeries = getFilteredContent(allContent.filter(c => c.type === 'series'));
  const kdramas = getFilteredContent(allContent.filter(c => c.type === 'kdrama'));
  const anime = getFilteredContent(allContent.filter(c => c.type === 'anime'));
  const documentaries = getFilteredContent(allContent.filter(c => c.type === 'documentary'));
  const actionContent = getFilteredContent(allContent.filter(c => c.genre.includes('Action')));
  const comedyContent = getFilteredContent(allContent.filter(c => c.genre.includes('Comedy')));
  const horrorContent = getFilteredContent(allContent.filter(c => c.genre.includes('Horror')));
  const thrillerContent = getFilteredContent(allContent.filter(c => c.genre.includes('Thriller')));

  // Continue watching
  const continueWatching = watchHistory
    .filter(h => !h.completed)
    .sort((a, b) => b.lastWatched - a.lastWatched)
    .map(h => allContent.find(c => c.id === h.contentId))
    .filter(Boolean) as Content[];

  if (currentView === 'player' && selectedContent) {
    const history = watchHistory.find(h => h.contentId === selectedContent.id);
    return (
      <VideoPlayer
        content={selectedContent}
        onBack={handleBackToHome}
        onUpdateProgress={handleUpdateProgress}
        startTime={history?.timestamp || 0}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <Profile
        watchHistory={watchHistory}
        allContent={allContent}
        onBack={() => setCurrentView('home')}
        onPlayContent={handlePlayContent}
      />
    );
  }

  if (currentView === 'admin' && isAdmin) {
    return (
      <AdminPanel
        allContent={allContent}
        onBack={() => setCurrentView('home')}
        onAddContent={handleAddContent}
        onDeleteContent={handleDeleteContent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header
        onProfileClick={() => setCurrentView('profile')}
        onLogoClick={() => setCurrentView('home')}
        onAdminLogin={handleAdminLogin}
        onSearch={handleSearch}
      />
      
      {!searchQuery && (
        <Hero
          content={trendingMovies[0] || allContent[0]}
          onPlay={() => handlePlayContent(trendingMovies[0] || allContent[0])}
        />
      )}

      <div className={`relative z-10 ${searchQuery ? 'pt-32' : '-mt-32'} pb-20`}>
        {searchQuery && (
          <div className="px-8 md:px-16 mb-8">
            <h2 className="text-2xl text-white">
              Search results for "{searchQuery}"
            </h2>
          </div>
        )}

        {continueWatching.length > 0 && !searchQuery && (
          <ContentRow
            title="Continue Watching"
            content={continueWatching}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {trendingMovies.length > 0 && (
          <ContentRow
            title="Trending Now"
            content={trendingMovies}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {movies.length > 0 && (
          <ContentRow
            title="Popular Movies"
            content={movies}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {tvSeries.length > 0 && (
          <ContentRow
            title="TV Series"
            content={tvSeries}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}

        {kdramas.length > 0 && (
          <ContentRow
            title="K-Dramas"
            content={kdramas}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {anime.length > 0 && (
          <ContentRow
            title="Anime"
            content={anime}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {actionContent.length > 0 && (
          <ContentRow
            title="Action & Adventure"
            content={actionContent}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {thrillerContent.length > 0 && (
          <ContentRow
            title="Thriller"
            content={thrillerContent}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {comedyContent.length > 0 && (
          <ContentRow
            title="Comedy"
            content={comedyContent}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {horrorContent.length > 0 && (
          <ContentRow
            title="Horror"
            content={horrorContent}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}
        
        {documentaries.length > 0 && (
          <ContentRow
            title="Documentaries"
            content={documentaries}
            onPlayContent={handlePlayContent}
            watchHistory={watchHistory}
          />
        )}

        {searchQuery && 
         trendingMovies.length === 0 && 
         movies.length === 0 && 
         tvSeries.length === 0 && 
         kdramas.length === 0 && 
         anime.length === 0 && (
          <div className="px-8 md:px-16 text-center py-20">
            <p className="text-white/50 text-xl">No results found for "{searchQuery}"</p>
            <p className="text-white/30 mt-2">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;