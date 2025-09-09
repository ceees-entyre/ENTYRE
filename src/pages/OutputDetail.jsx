import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const styles = {
  // Loading and Error States
  detailLoading: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: '16px',
  },

  errorContainer: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContent: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '20px',
  },

  errorTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    fontSize: '28px',
    marginBottom: '16px',
  },

  errorText: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '24px',
    lineHeight: '1.6',
  },

  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#003C69',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontFamily: "'FiraGO', sans-serif",
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },

  // Main Container
  articleDetailContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
  },

  // Navigation Bar
  articleNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '32px',
    position: 'sticky',
    top: '0',
    background: 'rgba(248, 250, 252, 0.9)',
    backdropFilter: 'blur(10px)',
    zIndex: 100,
  },

  navBackBtn: {
    background: 'transparent',
    border: '2px solid #D1D3D4',
    color: '#003C69',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'FiraGO', sans-serif",
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },

  navActions: {
    display: 'flex',
    gap: '12px',
  },

  iconButton: {
    width: '40px',
    height: '40px',
    border: '2px solid #D1D3D4',
    background: '#ffffff',
    color: '#003C69',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  bookmarked: {
    background: '#FFB500',
    borderColor: '#FFB500',
    color: 'white',
  },

  // Article Content
  articleContent: {
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
    marginBottom: '32px',
  },

  articleHeader: {
    padding: '48px 48px 32px 48px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
    borderBottom: '1px solid #f0f0f0',
  },

  articleMetaTop: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },

  articleCategory: {
    background: 'linear-gradient(135deg, #49C0B6, #006087)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  readingTime: {
    color: '#666',
    fontSize: '14px',
    padding: '6px 0',
    fontFamily: "'FiraGO', sans-serif",
  },

  articleTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    fontSize: '32px',
    lineHeight: '1.3',
    margin: '0 0 20px 0',
    fontWeight: '700',
  },

  articleSummary: {
    fontSize: '18px',
    color: '#555',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
    fontStyle: 'italic',
  },

  articleMetaBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
  },

  authors: {
    color: '#666',
    fontWeight: '500',
    fontFamily: "'FiraGO', sans-serif",
  },

  publishDate: {
    color: '#888',
    fontSize: '14px',
    fontFamily: "'FiraGO', sans-serif",
  },

  // Featured Image
  articleImageContainer: {
    width: '100%',
  },

  articleFeaturedImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    display: 'block',
  },

  // Article Body
  articleBody: {
    padding: '48px',
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#333',
    fontFamily: "'FiraGO', sans-serif",
  },

  // Article Footer
  articleFooter: {
    padding: '32px 48px',
    borderTop: '1px solid #f0f0f0',
    background: '#f8fafc',
  },

  articleTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },

  tag: {
    background: '#e2e8f0',
    color: '#003C69',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500',
  },

  articleActions: {
    display: 'flex',
    justifyContent: 'center',
  },

  printBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: '2px solid #D1D3D4',
    color: '#003C69',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'FiraGO', sans-serif",
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },

  // Related Articles
  relatedArticles: {
    marginTop: '48px',
  },

  relatedTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    fontSize: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },

  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },

  relatedCard: {
    background: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    border: '1px solid #f0f0f0',
  },

  relatedImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },

  relatedContent: {
    padding: '20px',
  },

  relatedCardTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    fontSize: '16px',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
  },

  relatedCardText: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // Share Modal
  modalOverlay: {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },

  shareModal: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '0',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #f0f0f0',
  },

  modalTitle: {
    fontFamily: "'Merriweather', Georgia, serif",
    color: '#003C69',
    margin: '0',
    fontSize: '20px',
  },

  modalClose: {
    width: '32px',
    height: '32px',
    border: 'none',
    background: 'transparent',
    color: '#888',
    fontSize: '24px',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  },

  shareOptions: {
    padding: '24px',
    display: 'grid',
    gap: '12px',
  },

  shareOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #f0f0f0',
    background: '#ffffff',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: "'FiraGO', sans-serif",
    fontWeight: '500',
    transition: 'all 0.3s ease',
    color: '#333',
  },
};

// Inject keyframes and hover effects
const injectStyles = () => {
  if (typeof document !== 'undefined' && !document.getElementById('detail-styles')) {
    const style = document.createElement('style');
    style.id = 'detail-styles';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .nav-back-btn:hover {
        border-color: #FFB500 !important;
        background: #f8fafc !important;
      }
      
      .icon-button:hover {
        border-color: #FFB500 !important;
        background: #f8fafc !important;
        transform: scale(1.05) !important;
      }
      
      .back-button:hover {
        background: #006087 !important;
        transform: translateY(-2px) !important;
      }
      
      .print-btn:hover {
        border-color: #FFB500 !important;
        background: #ffffff !important;
      }
      
      .related-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 8px 24px rgba(0, 60, 105, 0.12) !important;
        border-color: #FFB500 !important;
      }
      
      .modal-close:hover {
        background: #f0f0f0 !important;
        color: #003C69 !important;
      }
      
      .share-option:hover {
        border-color: #FFB500 !important;
        background: #f8fafc !important;
        transform: translateY(-1px) !important;
      }
      
      .share-option.twitter:hover {
        border-color: #1DA1F2 !important;
        color: #1DA1F2 !important;
      }
      
      .share-option.linkedin:hover {
        border-color: #0077B5 !important;
        color: #0077B5 !important;
      }
      
      .share-option.email:hover {
        border-color: #EA4335 !important;
        color: #EA4335 !important;
      }
      
      .share-option.copy:hover {
        border-color: #34D399 !important;
        color: #34D399 !important;
      }
      
      .article-body h2, .article-body h3, .article-body h4 {
        font-family: 'Merriweather', Georgia, serif !important;
        color: #003C69 !important;
        margin: 32px 0 16px 0 !important;
      }
      
      .article-body h2 {
        font-size: 28px !important;
        border-bottom: 2px solid #FFB500 !important;
        padding-bottom: 8px !important;
      }
      
      .article-body h3 {
        font-size: 24px !important;
      }
      
      .article-body h4 {
        font-size: 20px !important;
      }
      
      .article-body p {
        margin: 0 0 20px 0 !important;
      }
      
      .article-body a {
        color: #006087 !important;
        text-decoration: underline !important;
        transition: color 0.2s ease !important;
      }
      
      .article-body a:hover {
        color: #003C69 !important;
      }
      
      .article-body blockquote {
        border-left: 4px solid #FFB500 !important;
        padding: 24px !important;
        margin: 32px 0 !important;
        font-style: italic !important;
        color: #555 !important;
        background: #f8fafc !important;
        border-radius: 8px !important;
      }
      
      .article-body ul, .article-body ol {
        padding-left: 24px !important;
        margin: 20px 0 !important;
      }
      
      .article-body li {
        margin-bottom: 8px !important;
      }
      
      @media (max-width: 768px) {
        .article-detail-container {
          padding: 0 16px !important;
        }
        
        .nav-actions {
          gap: 8px !important;
        }
        
        .icon-button {
          width: 36px !important;
          height: 36px !important;
        }
        
        .article-header {
          padding: 32px 24px 24px 24px !important;
        }
        
        .article-title {
          font-size: 28px !important;
        }
        
        .article-body {
          padding: 32px 24px !important;
          font-size: 16px !important;
        }
        
        .article-footer {
          padding: 24px !important;
        }
        
        .article-meta-bottom {
          flex-direction: column !important;
          align-items: flex-start !important;
        }
        
        .related-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

export default function OutputDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const baseApi = 'https://entyre-backend.onrender.com';

  useEffect(() => {
    injectStyles();
    setLoading(true);
    
    // Fetch main article
    fetch(`${baseApi}/api/articles/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        
        // Calculate reading time (average 200 words per minute)
        const wordCount = data.content?.split(' ').length || 0;
        setReadingTime(Math.ceil(wordCount / 200));
        
        // Check if bookmarked
        const bookmarked = localStorage.getItem(`bookmark_${id}`) === 'true';
        setBookmarked(bookmarked);
        
        setLoading(false);
      })
      .catch(() => {
        setArticle(null);
        setLoading(false);
      });

    // Fetch related articles
    fetch(`${baseApi}/api/articles?limit=3&exclude=${id}`)
      .then(res => res.json())
      .then(data => setRelatedArticles(data || []))
      .catch(console.error);
  }, [id]);

  const handleBookmark = () => {
    const newBookmarkState = !bookmarked;
    setBookmarked(newBookmarkState);
    localStorage.setItem(`bookmark_${id}`, newBookmarkState.toString());
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || 'Research Article';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShareModalOpen(false);
  };

  if (loading) {
    return (
      <div style={styles.detailLoading}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <h2 style={styles.errorTitle}>Article Not Found</h2>
          <p style={styles.errorText}>The article you're looking for doesn't exist or may have been removed.</p>
          <Link to="/outputs" className="back-button" style={styles.backButton}>
            ← Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.articleDetailContainer}>
      {/* Navigation Bar */}
      <div style={styles.articleNav}>
        <button onClick={() => navigate(-1)} className="nav-back-btn" style={styles.navBackBtn}>
          ← Back
        </button>
        <div style={styles.navActions}>
          <button
            onClick={handleBookmark}
            className="icon-button"
            style={{
              ...styles.iconButton,
              ...(bookmarked ? styles.bookmarked : {})
            }}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d={bookmarked 
                ? "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
                : "M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
              }/>
            </svg>
          </button>
          <button
            onClick={() => setShareModalOpen(true)}
            className="icon-button"
            style={styles.iconButton}
            title="Share article"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <article style={styles.articleContent}>
        <header style={styles.articleHeader}>
          <div style={styles.articleMetaTop}>
            <span style={styles.articleCategory}>Research Article</span>
            <span style={styles.readingTime}>{readingTime} min read</span>
          </div>
          
          <h1 style={styles.articleTitle}>{article.title}</h1>
          
          {article.summary && (
            <p style={styles.articleSummary}>{article.summary}</p>
          )}
          
          <div style={styles.articleMetaBottom}>
            {article.authors && (
              <div style={styles.authors}>
                <span>By {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}</span>
              </div>
            )}
            {article.publishDate && (
              <time style={styles.publishDate}>
                {new Date(article.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div style={styles.articleImageContainer}>
            <img
              src={
                article.imageUrl.startsWith('http')
                  ? article.imageUrl
                  : `${baseApi}${article.imageUrl}`
              }
              alt={article.title}
              style={styles.articleFeaturedImage}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="article-body" style={styles.articleBody}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h2 {...props} />,
              h2: ({node, ...props}) => <h3 {...props} />,
              h3: ({node, ...props}) => <h4 {...props} />,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Article Footer */}
        <footer style={styles.articleFooter}>
          <div style={styles.articleTags}>
            {article.tags && article.tags.map(tag => (
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
          
          <div style={styles.articleActions}>
            <button onClick={() => window.print()} className="print-btn" style={styles.printBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
              </svg>
              Print
            </button>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <aside style={styles.relatedArticles}>
          <h3 style={styles.relatedTitle}>Related Articles</h3>
          <div style={styles.relatedGrid}>
            {relatedArticles.map(related => (
              <Link
                key={related._id || related.id}
                to={`/outputs/${related._id || related.id}`}
                className="related-card"
                style={styles.relatedCard}
              >
                {related.imageUrl && (
                  <img
                    src={
                      related.imageUrl.startsWith('http')
                        ? related.imageUrl
                        : `${baseApi}${related.imageUrl}`
                    }
                    alt=""
                    style={styles.relatedImage}
                  />
                )}
                <div style={styles.relatedContent}>
                  <h4 style={styles.relatedCardTitle}>{related.title}</h4>
                  <p style={styles.relatedCardText}>{related.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setShareModalOpen(false)}>
          <div style={styles.shareModal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Share Article</h3>
              <button 
                onClick={() => setShareModalOpen(false)}
                className="modal-close"
                style={styles.modalClose}
              >
                ×
              </button>
            </div>
            <div style={styles.shareOptions}>
              <button onClick={() => handleShare('twitter')} className="share-option twitter" style={styles.shareOption}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-option linkedin" style={styles.shareOption}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
              <button onClick={() => handleShare('email')} className="share-option email" style={styles.shareOption}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email
              </button>
              <button onClick={() => handleShare('copy')} className="share-option copy" style={styles.shareOption}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}