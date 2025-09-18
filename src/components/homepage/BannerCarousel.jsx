import React, { useState, useEffect, useRef } from 'react';

// Responsive aspect ratio for the banner
const ASPECT_RATIO = 1920 / 1080;

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const baseApi = 'https://entyre-backend.onrender.com/api/banners';
  const containerRef = useRef(null);

  useEffect(() => {
    let timer;
    let isMounted = true;

    fetch(baseApi)
      .then(res => res.json()) 
      .then(data => {
          const bannersArr = Array.isArray(data) ? data : [];
          if (isMounted) {
            setBanners(bannersArr);
            if (bannersArr.length > 0 && isPlaying) {
              timer = setInterval(() => {
                setCurrent(prev => (prev + 1) % bannersArr.length);
              }, 4000);
            }
          }
        })
      .catch(err => console.error("Banner fetch error", err));

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (current >= banners.length && banners.length > 0) {
      setCurrent(0);
    }
  }, [banners, current]);

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDotClick = (index) => {
    setCurrent(index);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % banners.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
    setIsPlaying(false);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    setShowModal(true);
    setIsPlaying(false);
  };

  const handleDownload = (imgUrl, title) => {
    const url = imgUrl && imgUrl.startsWith('http')
      ? imgUrl
      : `https://entyre-backend.onrender.com${imgUrl || ''}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = title ? `${title}.jpg` : 'banner.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const bannerCarouselStyle = {
    width: '100%',
    maxWidth: '1200px',
    aspectRatio: ASPECT_RATIO,
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#003C69',
    fontFamily: "'FiraGO', sans-serif",
    margin: '0 auto',
    position: 'relative',
    minHeight: '180px',
    overflow: 'hidden',
    borderRadius: '16px',
    boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
  };

  // Responsive image: fill container, keep aspect ratio, always show full image (contain)
  const bannerImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '16px',
    display: 'block',
    background: '#e5e7eb',
    userSelect: 'none',
    pointerEvents: 'auto',
    cursor: 'zoom-in'
  };

  const bannerCaptionStyle = { 
    background: 'rgba(0, 60, 105, 0.85)',
    fontFamily: "'FiraGO', sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '16px 32px',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    zIndex: 2,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const bannerDotsContainerStyle = {
    position: 'absolute',
    left: '50%',
    bottom: '16px',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 10
  };

  const bannerDotStyle = (active) => ({
    background: active ? '#FFB500' : 'rgba(255, 255, 255, 0.5)',
    border: active ? '2px solid #ffffff' : '2px solid transparent',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  });

  // Responsive nav button size
  const navBtnSize = '40px';

  if (!banners.length) {
    return (
      <div style={bannerCarouselStyle}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading latest updates...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Please wait while we fetch content</div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[current];
  const currentImageUrl = currentBanner.imageUrl && currentBanner.imageUrl.startsWith('http')
    ? currentBanner.imageUrl
    : `https://entyre-backend.onrender.com${currentBanner.imageUrl || ''}`;

  return (
    <div ref={containerRef} style={bannerCarouselStyle}>
      <a
        href={currentBanner.link || "#"}
        tabIndex={-1}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
        }}
        onClick={handleImageClick}
        title="Click and Preview"
      >
        <img
          src={currentImageUrl}
          alt={currentBanner.title || 'Banner Image'}
          style={bannerImageStyle}
          draggable={false}
        />
      </a>
      
      {/* Zoom in and preview */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            zIndex: 9999,
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '95vw',
              maxHeight: '90vh',
              boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={currentImageUrl}
              alt={currentBanner.title || 'Banner Image'}
              style={{
                maxWidth: '80vw',
                maxHeight: '70vh',
                borderRadius: '8px',
                marginBottom: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
              }}
            />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#003C69',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(currentBanner.imageUrl, currentBanner.title)}
                style={{
                  background: '#FFB500',
                  color: '#003C69',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(85, 149, 197, 0.8)',
              color: '#FFB500',
              border: 'none',
              borderRadius: '50%',
              width: navBtnSize,
              height: navBtnSize,
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={e => {
              e.target.style.background = '#FFB500';
              e.target.style.color = '#003C69';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(85, 149, 197, 0.8)';
              e.target.style.color = '#FFB500';
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 60, 105, 0.8)',
              color: '#FFB500',
              border: 'none',
              borderRadius: '50%',
              width: navBtnSize,
              height: navBtnSize,
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={e => {
              e.target.style.background = '#FFB500';
              e.target.style.color = '#003C69';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(0, 60, 105, 0.8)';
              e.target.style.color = '#FFB500';
            }}
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      <button
        onClick={handlePause}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 60, 105, 0.8)',
          color: '#FFB500',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: "'FiraGO', sans-serif",
          fontWeight: '500',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseEnter={e => {
          e.target.style.background = '#FFB500';
          e.target.style.color = '#003C69';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'rgba(0, 60, 105, 0.8)';
          e.target.style.color = '#FFB500';
        }}
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      
      <div style={bannerCaptionStyle}>
        {currentBanner.title}
      </div>
      
      <div style={bannerDotsContainerStyle}>
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            style={bannerDotStyle(idx === current)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      {/* Responsive styles for mobile */}
      <style>{`
        @media (max-width: 900px) {
          .banner-carousel-root {
            max-width: 100vw !important;
            min-height: 120px !important;
            border-radius: 10px !important;
          }
        }
        @media (max-width: 600px) {
          .banner-carousel-root {
            max-width: 100vw !important;
            min-height: 80px !important;
            border-radius: 6px !important;
          }
          .banner-caption {
            font-size: 14px !important;
            padding: 8px 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerCarousel;