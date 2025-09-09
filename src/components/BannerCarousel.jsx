import React, { useState, useEffect } from 'react';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const baseApi = 'https://entyre-backend.onrender.com/api/banners';

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

  const bannerCarouselStyle = {
    width: '1200px',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#003C69',
    fontFamily: "'FiraGO', sans-serif",
    margin: '0 auto'
  };

  const bannerImageStyle = {
    width: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
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
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    zIndex: 2
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

  if (!banners.length) {
    return (
      <div style={bannerCarouselStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading latest updates...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Please wait while we fetch content</div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[current];

  return (
    <div style={{ ...bannerCarouselStyle, position: 'relative', minHeight: 260, padding: 0 }}>
      <a href={currentBanner.link || "#"} tabIndex={-1} style={{ display: 'block' }}>
        <img
          src={currentBanner.imageUrl && currentBanner.imageUrl.startsWith('http')
            ? currentBanner.imageUrl
            : `https://entyre-backend.onrender.com${currentBanner.imageUrl || ''}`
          }
          alt={currentBanner.title || 'Banner Image'}
          style={bannerImageStyle}
        />
      </a>
      
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(85, 149, 197, 0.8)',
              color: '#FFB500',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#FFB500';
              e.target.style.color = '#003C69';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 60, 105, 0.8)';
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
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 60, 105, 0.8)',
              color: '#FFB500',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#FFB500';
              e.target.style.color = '#003C69';
            }}
            onMouseLeave={(e) => {
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
        onMouseEnter={(e) => {
          e.target.style.background = '#FFB500';
          e.target.style.color = '#003C69';
        }}
        onMouseLeave={(e) => {
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
    </div>
  );
};

export default BannerCarousel;