import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

const styles = {
  // Loading States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: '#003C69',
    fontFamily: "'FiraGO', sans-serif",
  },
  
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #D1D3D4',
    borderTop: '4px solid #003C69',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Main Container
  introWrapper: {
    maxWidth: '90%',
    margin: '0 auto',
    fontFamily: "'FiraGO', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: '#003C69',
    lineHeight: 1.7,
  },

  // Search and Filter Controls
  contentControls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    margin: '32px 0',
    padding: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
    borderRadius: '16px',
    border: '1px solid #D1D3D4',
    boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
  },

  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '300px',
  },

  searchInput: {
    width: '100%',
    padding: '14px 48px 14px 16px',
    border: '2px solid #D1D3D4',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: "'FiraGO', sans-serif",
    background: '#ffffff',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },

  searchIcon: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
    pointerEvents: 'none',
    width: '20px',
    height: '20px',
  },

  filterControls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  selectInput: {
    padding: '12px 16px',
    border: '2px solid #D1D3D4',
    borderRadius: '12px',
    background: '#ffffff',
    fontFamily: "'FiraGO', sans-serif",
    fontSize: '14px',
    color: '#003C69',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '140px',
  },

  // Results Summary
  resultsSummary: {
    margin: '16px 0 24px 0',
    color: '#666',
    fontSize: '14px',
    fontFamily: "'FiraGO', sans-serif",
  },

  // Articles Grid
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    margin: '32px 0',
  },

  modernArticleCard: {
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    cursor: 'pointer',
  },

  articleImageContainer: {
    position: 'relative',
    overflow: 'hidden',
    height: '200px',
  },

  articleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },

  articleOverlay: {
    position: 'absolute',
    inset: '0',
    background: 'linear-gradient(45deg, rgba(0, 60, 105, 0.8), rgba(73, 192, 182, 0.6))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    transition: 'opacity 0.3s ease',
  },

  readMore: {
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
  },

  articleContent: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  articleTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    fontSize: '20px',
    color: '#003C69',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
    fontWeight: '600',
  },

  articleSummary: {
    color: '#555',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontSize: '14px',
  },

  articleMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },

  articleTag: {
    background: 'linear-gradient(135deg, #49C0B6, #006087)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  articleDate: {
    color: '#888',
    fontSize: '13px',
  },

  // Pagination
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    margin: '48px 0',
    flexWrap: 'wrap',
  },

  paginationBtn: {
    padding: '12px 20px',
    border: '2px solid #D1D3D4',
    background: '#ffffff',
    color: '#003C69',
    borderRadius: '12px',
    fontFamily: "'FiraGO', sans-serif",
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  pageNumbers: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },

  pageNumber: {
    width: '44px',
    height: '44px',
    border: '2px solid #D1D3D4',
    background: '#ffffff',
    color: '#003C69',
    borderRadius: '12px',
    fontFamily: "'FiraGO', sans-serif",
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageNumberActive: {
    background: '#003C69',
    color: 'white',
    borderColor: '#003C69',
  },

  pageEllipsis: {
    color: '#888',
    padding: '0 8px',
  },

  // Videos Section
  videosSection: {
    margin: '64px 0',
  },

  videosSectionTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    fontSize: '28px',
    marginBottom: '32px',
    textAlign: 'center',
  },

  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  modernVideoCard: {
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  videoThumbnailContainer: {
    position: 'relative',
    height: '250px',
    overflow: 'hidden',
    cursor: 'pointer',
  },

  videoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0',
    transition: 'transform 0.4s ease',
  },

  videoOverlay: {
    position: 'absolute',
    inset: '0',
    background: 'linear-gradient(45deg, rgba(0, 60, 105, 0.3), rgba(73, 192, 182, 0.3))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  playButtonModern: {
    width: '64px',
    height: '64px',
    background: 'rgba(255, 181, 0, 0.9)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#003C69',
    fontSize: '24px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  videoDuration: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
  },

  videoPlayerModern: {
    position: 'relative',
    height: '250px',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  videoLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  closeVideoBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.2s ease',
  },

  videoInfo: {
    padding: '20px',
  },

  videoTitleModern: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    fontSize: '18px',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
  },

  videoDescription: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  videoFrame: {
    border: '0',
    width: '100%',
    height: '100%',
  },

  modernVideoPlayer: {
    width: '100%',
    height: '100%',
  },
};

// CSS keyframes need to be injected
const injectKeyframes = () => {
  if (typeof document !== 'undefined' && !document.getElementById('keyframes-styles')) {
    const style = document.createElement('style');
    style.id = 'keyframes-styles';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .modern-article-card:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 12px 32px rgba(0, 60, 105, 0.15) !important;
        border-color: #FFB500 !important;
      }
      
      .modern-article-card:hover .article-image {
        transform: scale(1.05) !important;
      }
      
      .modern-article-card:hover .article-overlay {
        opacity: 1 !important;
      }
      
      .modern-video-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 12px 32px rgba(0, 60, 105, 0.15) !important;
      }
      
      .video-thumbnail-container:hover .video-thumb {
        transform: scale(1.05) !important;
      }
      
      .video-thumbnail-container:hover .video-overlay {
        background: linear-gradient(45deg, rgba(0, 60, 105, 0.5), rgba(73, 192, 182, 0.5)) !important;
      }
      
      .video-thumbnail-container:hover .play-button-modern {
        transform: scale(1.1) !important;
        background: rgba(255, 181, 0, 1) !important;
      }
      
      .search-input:focus {
        outline: none !important;
        border-color: #003C69 !important;
        box-shadow: 0 0 0 3px rgba(0, 60, 105, 0.1) !important;
      }
      
      .select-input:focus {
        outline: none !important;
        border-color: #003C69 !important;
        box-shadow: 0 0 0 3px rgba(0, 60, 105, 0.1) !important;
      }
      
      .pagination-btn:hover:not(:disabled) {
        background: #f8fafc !important;
        border-color: #FFB500 !important;
        transform: translateY(-1px) !important;
      }
      
      .pagination-btn:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
      }
      
      .page-number:hover {
        background: #f8fafc !important;
        border-color: #FFB500 !important;
        transform: translateY(-1px) !important;
      }
      
      .close-video-btn:hover {
        background: rgba(0, 0, 0, 0.9) !important;
        transform: scale(1.1) !important;
      }
      
      @media (max-width: 768px) {
        .articles-grid {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
        }
        
        .videos-grid {
          grid-template-columns: 1fr !important;
          gap: 24px !important;
        }
        
        .content-controls {
          flex-direction: column !important;
          gap: 16px !important;
        }
        
        .search-container {
          min-width: unset !important;
        }
        
        .filter-controls {
          flex-direction: column !important;
        }
        
        .select-input {
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

function ArticleCard({ article }) {
  const articleId = article._id || article.id;
  
  return (
    <Link
      className="modern-article-card"
      to={`/outputs/${articleId}`}
      style={styles.modernArticleCard}
    >
      {article.imageUrl && (
        <div className="article-image-container" style={styles.articleImageContainer}>
          <img
            src={
              article.imageUrl.startsWith('http')
                ? article.imageUrl
                : `https://entyre-backend.onrender.com${article.imageUrl}`
            }
            alt=""
            className="article-image"
            style={styles.articleImage}
          />
          <div className="article-overlay" style={styles.articleOverlay}>
            <span style={styles.readMore}>Read More →</span>
          </div>
        </div>
      )}
      <div style={styles.articleContent}>
        <h3 style={styles.articleTitle}>{article.title}</h3>
        <p style={styles.articleSummary}>{article.summary}</p>
        <div style={styles.articleMeta}>
          <span style={styles.articleTag}>Research</span>
          {article.publishDate && (
            <span style={styles.articleDate}>
              {new Date(article.publishDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function VideoCard({ video }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');
  
  const handlePlayClick = () => {
    setIsLoading(true);
    setShowPlayer(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="modern-video-card" style={styles.modernVideoCard}>
      {!showPlayer ? (
        <div
          className="video-thumbnail-container"
          style={styles.videoThumbnailContainer}
          onClick={handlePlayClick}
        >
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt=""
              className="video-thumb"
              style={styles.videoThumb}
            />
          )}
          <div className="video-overlay" style={styles.videoOverlay}>
            <div className="play-button-modern" style={styles.playButtonModern}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div style={styles.videoDuration}>
              {video.duration || '5:23'}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.videoPlayerModern}>
          {isLoading ? (
            <div style={styles.videoLoading}>
              <div style={{...styles.loadingSpinner, width: '32px', height: '32px', border: '3px solid #D1D3D4', borderTop: '3px solid #FFB500'}}></div>
            </div>
          ) : (
            <>
              {isYouTube ? (
                <iframe
                  style={styles.videoFrame}
                  src={video.videoUrl.replace('watch?v=', 'embed/')}
                  title={video.title || video.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  style={styles.modernVideoPlayer}
                >
                  <source src={video.videoUrl} />
                  Your browser does not support the video tag.
                </video>
              )}
              <button 
                className="close-video-btn"
                style={styles.closeVideoBtn}
                onClick={() => setShowPlayer(false)}
              >
                ×
              </button>
            </>
          )}
        </div>
      )}
      <div style={styles.videoInfo}>
        <h4 style={styles.videoTitleModern}>{video.title || video.videoTitle}</h4>
        <p style={styles.videoDescription}>{video.description}</p>
      </div>
    </div>
  );
}

export default function KeyOutputs() {
  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const baseApi = 'https://entyre-backend.onrender.com';
  const articlesPerPage = 6;

  useEffect(() => {
    injectKeyframes();
    setIsLoading(true);
    
    Promise.all([
      fetch(import.meta.env.BASE_URL + 'content/outputs.md').then(res => res.text()),
      fetch(`${baseApi}/api/articles`).then(res => res.json()),
      fetch(`${baseApi}/api/videos`).then(res => res.json())
    ]).then(([markdownText, articlesData, videosData]) => {
      const parts = markdownText.split('<!-- split -->');
      setSections(parts);
      setArticles(articlesData || []);
      setVideos(videosData || []);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error loading data:', error);
      setIsLoading(false);
    });
  }, []);

  // Filter and sort articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt);
      case 'oldest':
        return new Date(a.publishDate || a.createdAt) - new Date(b.publishDate || b.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const currentArticles = sortedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading publications...</p>
      </div>
    );
  }

  return (
    <div style={styles.introWrapper}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sections[0] || ''}
      </ReactMarkdown>

      {/* Search and Filter Controls */}
      <div style={styles.contentControls}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
            style={styles.searchInput}
          />
          <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        
        <div style={styles.filterControls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select-input"
            style={styles.selectInput}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="select-input"
            style={styles.selectInput}
          >
            <option value="all">All Categories</option>
            <option value="research">Research</option>
            <option value="review">Review</option>
            <option value="case-study">Case Study</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div style={styles.resultsSummary}>
        <p>
          Showing {currentArticles.length} of {filteredArticles.length} publications
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid" style={styles.articlesGrid}>
        {currentArticles.map(article => (
          <ArticleCard key={article._id || article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            style={styles.paginationBtn}
          >
            ← Previous
          </button>
          
          <div style={styles.pageNumbers}>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className="page-number"
                    style={{
                      ...styles.pageNumber,
                      ...(currentPage === page ? styles.pageNumberActive : {})
                    }}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page} style={styles.pageEllipsis}>...</span>;
              }
              return null;
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            style={styles.paginationBtn}
          >
            Next →
          </button>
        </div>
      )}

      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sections[1] || ''}
      </ReactMarkdown>

      {/* Videos Section */}
      <div style={styles.videosSection}>
        <h2 style={styles.videosSectionTitle}>Featured Videos</h2>
        <div className="videos-grid" style={styles.videosGrid}>
          {videos.map(video => (
            <VideoCard key={video.id || video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}