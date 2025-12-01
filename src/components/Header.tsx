import { useState } from 'react';
import { Search, Bell, User, LogIn, X } from 'lucide-react';

type HeaderProps = {
  onProfileClick: () => void;
  onLogoClick: () => void;
  onAdminLogin: (email: string, password: string) => void;
  onSearch: (query: string) => void;
};

export function Header({ onProfileClick, onLogoClick, onAdminLogin, onSearch }: HeaderProps) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Mock notifications
  const [notifications] = useState([
    { id: 1, text: 'New K-Drama "Moonlight Romance" added', time: '5m ago', unread: true },
    { id: 2, text: 'Continue watching "Neon Horizons"', time: '1h ago', unread: true },
    { id: 3, text: 'New season of "Shadow Protocol" available', time: '3h ago', unread: false },
    { id: 4, text: '"The Last Voyage" has been added to your list', time: '1d ago', unread: false },
  ]);

  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email === 'kjento.mertes@gmail.com' && password === 'Kjentocaje3') {
      onAdminLogin(email, password);
      setShowAdminLogin(false);
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      onSearch(value);
    } else {
      onSearch('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <button onClick={onLogoClick} className="flex items-center gap-2 group">
              <div className="text-red-600 transform transition-transform group-hover:scale-105">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M5 5 L15 5 L15 35 L5 35 Z" />
                  <path d="M20 5 L30 5 L30 20 L20 20 Z" />
                  <path d="M20 25 L35 25 L35 35 L20 35 Z" />
                </svg>
              </div>
              <span className="text-2xl tracking-tight">
                <span className="text-white">Stream</span>
                <span className="text-red-600">Wave</span>
                <span className="text-red-600/60">.Net</span>
              </span>
            </button>
            
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-white hover:text-red-500 transition-colors">Home</button>
              <button className="text-white/70 hover:text-red-500 transition-colors">TV Shows</button>
              <button className="text-white/70 hover:text-red-500 transition-colors">Movies</button>
              <button className="text-white/70 hover:text-red-500 transition-colors">K-Drama</button>
              <button className="text-white/70 hover:text-red-500 transition-colors">Anime</button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-slide-down">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search titles..."
                  autoFocus
                  className="bg-black/80 border border-red-600/30 rounded px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-red-600 transition-colors w-64"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="text-white/70 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="text-white/70 hover:text-red-500 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white/70 hover:text-red-500 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-black/95 backdrop-blur-sm border border-red-600/20 rounded-lg shadow-2xl overflow-hidden animate-slide-down">
                  <div className="px-4 py-3 border-b border-red-600/20">
                    <h3 className="text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-red-600/10 transition-colors cursor-pointer ${
                          notif.unread ? 'bg-red-600/5' : ''
                        }`}
                      >
                        <p className="text-white text-sm mb-1">{notif.text}</p>
                        <span className="text-white/50 text-xs">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="text-white/70 hover:text-red-500 transition-colors"
              title="Admin Login"
            >
              <LogIn className="w-5 h-5" />
            </button>
            <button
              onClick={onProfileClick}
              className="w-8 h-8 rounded bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {showAdminLogin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-red-600/20 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl text-white mb-6">Admin Login</h2>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@streamwave.net"
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-600/20 border border-red-600/40 rounded px-4 py-2 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setError('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}