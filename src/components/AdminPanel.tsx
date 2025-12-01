import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Film, Search, Edit, BarChart3, Download, Upload, CheckSquare } from 'lucide-react';
import type { Content } from '../App';

type AdminPanelProps = {
  allContent: Content[];
  onBack: () => void;
  onAddContent: (content: Content) => void;
  onDeleteContent: (contentId: string) => void;
};

export function AdminPanel({ allContent, onBack, onAddContent, onDeleteContent }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'analytics' | 'bulk'>('content');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    backdrop: '',
    description: '',
    duration: '',
    year: '',
    rating: 'PG-13',
    genre: '',
    videoUrl: '',
    type: 'movie' as Content['type'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContent: Content = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      thumbnail: formData.thumbnail,
      backdrop: formData.backdrop,
      description: formData.description,
      duration: parseInt(formData.duration) * 60,
      year: parseInt(formData.year),
      rating: formData.rating,
      genre: formData.genre.split(',').map(g => g.trim()),
      videoUrl: formData.videoUrl,
      type: formData.type,
    };

    onAddContent(newContent);
    setShowAddForm(false);
    resetForm();
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      thumbnail: content.thumbnail,
      backdrop: content.backdrop,
      description: content.description,
      duration: String(Math.floor(content.duration / 60)),
      year: String(content.year),
      rating: content.rating,
      genre: content.genre.join(', '),
      videoUrl: content.videoUrl,
      type: content.type,
    });
    setShowEditForm(true);
  };

  const handleUpdateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    onDeleteContent(editingContent.id);
    
    const updatedContent: Content = {
      id: editingContent.id,
      title: formData.title,
      thumbnail: formData.thumbnail,
      backdrop: formData.backdrop,
      description: formData.description,
      duration: parseInt(formData.duration) * 60,
      year: parseInt(formData.year),
      rating: formData.rating,
      genre: formData.genre.split(',').map(g => g.trim()),
      videoUrl: formData.videoUrl,
      type: formData.type,
    };

    onAddContent(updatedContent);
    setShowEditForm(false);
    setEditingContent(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      thumbnail: '',
      backdrop: '',
      description: '',
      duration: '',
      year: '',
      rating: 'PG-13',
      genre: '',
      videoUrl: '',
      type: 'movie',
    });
  };

  const handleDelete = (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      onDeleteContent(contentId);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) {
      alert('No items selected');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) {
      selectedItems.forEach(id => onDeleteContent(id));
      setSelectedItems(new Set());
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredContent.map(c => c.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(allContent, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streamwave-content-${Date.now()}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach(item => onAddContent(item));
          alert(`Successfully imported ${imported.length} items`);
        }
      } catch (error) {
        alert('Error importing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  // Filter content
  const filteredContent = allContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    return matchesSearch && matchesType;
  });

  // Analytics
  const stats = {
    total: allContent.length,
    movies: allContent.filter(c => c.type === 'movie').length,
    series: allContent.filter(c => c.type === 'series').length,
    kdrama: allContent.filter(c => c.type === 'kdrama').length,
    anime: allContent.filter(c => c.type === 'anime').length,
    documentary: allContent.filter(c => c.type === 'documentary').length,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black/95 backdrop-blur-sm border-b border-red-600/20">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back</span>
            </button>
            <div className="h-8 w-px bg-red-600/30" />
            <h1 className="text-2xl text-white">Admin Panel</h1>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Content</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-8 border-t border-red-600/10">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 transition-colors border-b-2 ${
              activeTab === 'content'
                ? 'border-red-600 text-white'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>Content Library</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-red-600 text-white'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-3 transition-colors border-b-2 ${
              activeTab === 'bulk'
                ? 'border-red-600 text-white'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>Bulk Operations</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-40 px-8 md:px-16 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'content' && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search content..."
                    className="w-full bg-zinc-900/50 border border-red-600/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-zinc-900/50 border border-red-600/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="series">TV Series</option>
                  <option value="kdrama">K-Drama</option>
                  <option value="anime">Anime</option>
                  <option value="documentary">Documentary</option>
                </select>
              </div>

              {/* Content List */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-white">All Content</h2>
                <span className="text-white/50">{filteredContent.length} items</span>
              </div>

              <div className="grid gap-4">
                {filteredContent.map((content) => (
                  <div
                    key={content.id}
                    className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-4 hover:border-red-600/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-32 h-20 object-cover rounded flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-white text-lg mb-2">{content.title}</h3>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mb-2">
                              <span className="px-2 py-0.5 border border-white/30 rounded">
                                {content.rating}
                              </span>
                              <span>{content.year}</span>
                              <span>•</span>
                              <span>{Math.floor(content.duration / 60)} min</span>
                              <span>•</span>
                              <span className="capitalize">{content.type}</span>
                              <span>•</span>
                              <span>{content.genre.join(', ')}</span>
                            </div>

                            <p className="text-white/70 text-sm line-clamp-2">
                              {content.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(content)}
                              className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded border border-blue-600/30 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(content.id)}
                              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 px-4 py-2 rounded border border-red-600/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-2xl text-white">Platform Analytics</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-600/30 rounded-lg p-6">
                  <div className="text-red-500 text-3xl mb-2">{stats.total}</div>
                  <div className="text-white/70">Total Content</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                  <div className="text-blue-400 text-3xl mb-2">{stats.movies}</div>
                  <div className="text-white/70">Movies</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-600/30 rounded-lg p-6">
                  <div className="text-purple-400 text-3xl mb-2">{stats.series}</div>
                  <div className="text-white/70">TV Series</div>
                </div>
                <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 border border-pink-600/30 rounded-lg p-6">
                  <div className="text-pink-400 text-3xl mb-2">{stats.kdrama}</div>
                  <div className="text-white/70">K-Dramas</div>
                </div>
                <div className="bg-gradient-to-br from-orange-600/20 to-orange-900/20 border border-orange-600/30 rounded-lg p-6">
                  <div className="text-orange-400 text-3xl mb-2">{stats.anime}</div>
                  <div className="text-white/70">Anime</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-600/30 rounded-lg p-6">
                  <div className="text-green-400 text-3xl mb-2">{stats.documentary}</div>
                  <div className="text-white/70">Documentaries</div>
                </div>
              </div>

              {/* Content Distribution */}
              <div className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-6">
                <h3 className="text-xl text-white mb-4">Content Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(stats).filter(([key]) => key !== 'total').map(([type, count]) => {
                    const percentage = (count / stats.total) * 100;
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 capitalize">{type}</span>
                          <span className="text-white">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white">Bulk Operations</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded border border-green-600/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
                  </button>
                  <label className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded border border-blue-600/30 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-red-600/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <CheckSquare className="w-5 h-5" />
                    <span>{selectedItems.size === filteredContent.length ? 'Deselect All' : 'Select All'}</span>
                  </button>
                  {selectedItems.size > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected ({selectedItems.size})</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {filteredContent.map((content) => (
                    <div
                      key={content.id}
                      className={`flex items-center gap-4 p-3 rounded transition-all cursor-pointer ${
                        selectedItems.has(content.id)
                          ? 'bg-red-600/20 border border-red-600/40'
                          : 'bg-black/30 border border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => toggleSelectItem(content.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.has(content.id)}
                        onChange={() => toggleSelectItem(content.id)}
                        className="w-5 h-5 rounded border-white/30 bg-black/50 checked:bg-red-600"
                      />
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-white">{content.title}</div>
                        <div className="text-white/50 text-sm capitalize">{content.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Content Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-red-600/20 rounded-lg w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-zinc-900 border-b border-red-600/20 px-8 py-6 flex items-center justify-between rounded-t-lg">
              <h2 className="text-2xl text-white flex items-center gap-3">
                <Film className="w-6 h-6 text-red-500" />
                {showEditForm ? 'Edit Content' : 'Add New Content'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingContent(null);
                  resetForm();
                }}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={showEditForm ? handleUpdateContent : handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-white mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Content['type'] })}
                    className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                    <option value="kdrama">K-Drama</option>
                    <option value="anime">Anime</option>
                    <option value="documentary">Documentary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="TV-14">TV-14</option>
                    <option value="TV-MA">TV-MA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Genres (comma-separated) *</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="Action, Thriller, Sci-Fi"
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Thumbnail URL *</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Backdrop URL *</label>
                <input
                  type="url"
                  value={formData.backdrop}
                  onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                  placeholder="https://example.com/backdrop.jpg"
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Video URL *</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                  className="w-full bg-black/50 border border-red-600/30 rounded px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 transition-colors"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded transition-colors"
                >
                  {showEditForm ? 'Update Content' : 'Add Content'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setEditingContent(null);
                    resetForm();
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
