import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BannerCarousel from '../components/BannerCarousel'

// Dynamic Section Renderer
const DynamicSection = ({ section }) => {

  // Get layout styles
  const getContainerStyles = () => {
    const baseStyles = {
      marginBottom: section.layout?.padding === 'none' ? '0' : 
                   section.layout?.padding === 'small' ? '24px' :
                   section.layout?.padding === 'large' ? '72px' : '48px'
    };

    // Container width
    const maxWidth = section.layout?.containerWidth === 'narrow' ? '1800px' :
                    section.layout?.containerWidth === 'contained' ? '1800px' : '100%';
    
    if (maxWidth !== '100%') {
      baseStyles.maxWidth = maxWidth;
      baseStyles.margin = `0 auto ${baseStyles.marginBottom}`;
    }

    // Background
    if (section.layout?.background && section.layout.background !== 'transparent') {
      const backgrounds = {
        'white': '#ffffff',
        'gray': '#f8fafc',
        'gradient-1': 'linear-gradient(135deg, #003C69 0%, #006087 100%)',
        'gradient-2': 'linear-gradient(135deg, #49C0B6 0%, #0A6836 100%)',
        'custom': section.layout?.customBackground || '#ffffff'
      };
      baseStyles.background = backgrounds[section.layout.background] || backgrounds.white;
      baseStyles.padding = '48px';
      baseStyles.borderRadius = '16px';
      
      if (section.layout.background.includes('gradient')) {
        baseStyles.color = 'white';
      }
    }

    // Text alignment
    if (section.layout?.textAlign) {
      baseStyles.textAlign = section.layout.textAlign;
    }

    return baseStyles;
  };

  const getTitleStyles = () => {
    const sizes = {
      h1: { fontSize: '2.8rem', fontWeight: '1000'},
      h2: { fontSize: '2.2rem', fontWeight: '600' },
      h3: { fontSize: '1.8rem', fontWeight: '600' },
      h4: { fontSize: '1.4rem', fontWeight: '600' },
      h5: { fontSize: '1.2rem', fontWeight: '600' },
      h6: { fontSize: '1rem', fontWeight: '600' }
    };
    
    return {
      ...sizes[section.typography?.titleSize || 'h1'],
      color: section.typography?.titleColor || '#003C69',
      fontFamily: "'Merriweather', Georgia, serif",
      marginBottom: '20px',
      lineHeight: '1.3'
    };
  };

  const containerStyles = getContainerStyles();
  const titleStyles = getTitleStyles();

  // Render different section types
  switch (section.type) {
    case 'hero':
      return (
        <section
          style={{
            ...containerStyles,
          }}
        >
          <h1
            style={{
              ...titleStyles,
              fontSize:'2.8rem',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            {section.title}
          </h1>
          <div
            style={{
              maxWidth: '90%',
              height: '2px',
              background: '#FFB500',
              margin: '0 auto 28px auto',
              borderRadius: '2px'
            }}
          />
          {section.heroSubtitle && (
            <div>
              {section.heroSubtitle}
            </div>
          )}
          {section.content && (
            <div
              style={{
                fontSize: '1.3rem',
                marginBottom: '32px',
                fontWeight: 400,
                lineHeight: 1.6,
                textAlign: 'center',
                maxWidth: '70%',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            </div>
          )}
          {section.heroButtons && section.heroButtons.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '8px'
              }}
            >
              {section.heroButtons.map((btn, idx) => {
                let background, color, border;
                if (btn.style === 'primary') {
                  background = '#FFB500';
                  color = '#003C69';
                  border = 'none';
                } else if (btn.style === 'secondary') {
                  background = 'transparent';
                  color = '#fff';
                  border = '2px solid #fff';
                } else if (btn.style === 'outline') {
                  background = 'transparent';
                  color = '#FFB500';
                  border = '2px solid #FFB500';
                } else {
                  background = 'transparent';
                  color = '#fff';
                  border = 'none';
                }
                return (
                  <a
                    key={idx}
                    href={btn.link}
                    target={btn.external ? '_blank' : '_self'}
                    rel={btn.external ? 'noopener noreferrer' : undefined}
                    style={{
                      background,
                      color,
                      border,
                      padding: '10px 28px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '15px',
                      transition: 'all 0.2s',
                      display: 'inline-block',
                      boxShadow: btn.style === 'primary' ? '0 2px 8px 0 rgba(0,0,0,0.04)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {btn.text}
                  </a>
                );
              })}
            </div>
          )}
        </section>
      );

    case 'features-grid':
      return (
        <section style={containerStyles}>
          {section.title && <h2 style={titleStyles}>{section.title}</h2>}
          {section.content && (
            <div style={{ marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            </div>
          )}
          {section.features && section.features.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
              gap: section.layout?.gap === 'small' ? '16px' : section.layout?.gap === 'large' ? '32px' : '24px'
            }}>
              {section.features.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {feature.icon && (
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                      {feature.icon}
                    </div>
                  )}
                  <h3 style={{
                    fontSize: '1.4rem',
                    marginBottom: '16px',
                    color: '#003C69'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '24px'
                  }}>
                    {feature.description}
                  </p>
                  {feature.link && feature.linkText && (
                    <a
                      href={feature.link}
                      style={{
                        background: '#003C69',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        display: 'inline-block'
                      }}
                    >
                      {feature.linkText}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      );

    case 'stats':
      return (
        <section
          style={{
            ...containerStyles,
            background: '#f8fafc',
            border: '1px solid #f1f3f6',
            borderRadius: '10px',
            padding: '32px 32px 32px 32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '32px',
            boxSizing: 'border-box',
            position: 'relative',
            maxWidth: '100%',
            margin: '0 auto 48px auto'
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {section.title && (
              <h2
                style={{
                  ...titleStyles,
                  color: '#003C69',
                  fontSize: '1.5rem',
                  marginBottom: '18px'
                }}
              >
                {section.title}
              </h2>
            )}
            {section.content && (
              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  color: '#444',
                  marginBottom: 0
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {section.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          {section.stats && section.stats.length > 0 && (
            <div
              style={{
                flex: '0 0 320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {section.stats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                    padding: '32px 36px',
                    minWidth: '220px',
                    textAlign: 'center',
                    border: '1px solid #f1f3f6'
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.4rem',
                      fontWeight: 600,
                      color: stat.color || '#CE1F2C',
                      marginBottom: '8px',
                      fontFamily: "'FiraGO', sans-serif"
                    }}
                  >
                    {stat.number}
                  </div>
                  {/* <div
                    style={{
                      fontSize: '1rem',
                      color: '#666',
                      marginBottom: stat.description ? '8px' : 0
                    }}
                  >
                    {stat.label}
                  </div> */}
                  {stat.description && (
                    <div
                      style={{
                        color: '#888',
                        fontSize: '1rem',
                        marginTop: '4px'
                      }}
                    >
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      );

    case 'process-steps':
      return (
        <section
          style={{
            ...containerStyles,
            background: 'linear-gradient(135deg, #49C0B6 0%, #0A6836 100%)',
            borderRadius: '12px',
            padding: '48px 0',
            maxWidth: '100%',
            boxShadow: 'none',
          }}
        >
          {section.title && (
            <h2
              style={{
                fontFamily: "'Merriweather', serif",
                color: '#003C69',
                textAlign: 'center',
                marginBottom: '40px',
                fontWeight: 700,
                fontSize: '2.1rem',
                letterSpacing: 0.1,
                lineHeight: 1.2,
              }}
            >
              {section.title}
            </h2>
          )}
          {section.steps && section.steps.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '0',
                maxWidth: '900px',
                margin: '0 auto',
                flexWrap: 'wrap',
                minHeight: '220px',
                position: 'relative',
              }}
            >
              {section.steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 0',
                    minWidth: '180px',
                    maxWidth: '220px',
                    textAlign: 'center',
                    margin: '0 0',
                    padding: '0 10px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.32)',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                      fontSize: '1.18rem',
                      fontWeight: 700,
                      color: '#fff',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                      fontFamily: "'FiraGO', sans-serif",
                    }}
                  >
                    {step.icon || step.stepNumber}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '1.04rem',
                      color: '#003C69',
                      marginBottom: '6px',
                      fontFamily: "'FiraGO', sans-serif",
                      letterSpacing: 0.1,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.93rem',
                      color: '#e6f2ef',
                      minHeight: '32px',
                      marginBottom: idx === section.steps.length - 1 ? 0 : '0',
                      fontFamily: "'FiraGO', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {step.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      );

    case 'gallery':
      return (
        <section style={containerStyles}>
          {section.title && <h2 style={titleStyles}>{section.title}</h2>}
          {section.content && (
            <div style={{ marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            </div>
          )}
          {section.images && section.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
              gap: '20px'
            }}>
              {section.images.map((img, idx) => (
                <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  {img.link ? (
                    <a href={img.link} target="_blank" rel="noopener noreferrer">
                      <img src={img.url} alt={img.alt || `Gallery image ${idx + 1}`} style={{
                        width: '100%', height: '200px', objectFit: 'cover'
                      }} />
                    </a>
                  ) : (
                    <img src={img.url} alt={img.alt || `Gallery image ${idx + 1}`} style={{
                      width: '100%', height: '200px', objectFit: 'cover'
                    }} />
                  )}
                  {img.caption && (
                    <p style={{
                      padding: '12px',
                      background: '#f8fafc',
                      margin: '0',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      );

    case 'video':
      return (
        <section style={containerStyles}>
          {section.title && <h2 style={titleStyles}>{section.title}</h2>}
          {section.content && (
            <div style={{ marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            </div>
          )}
          {section.videoUrl && (
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: '0',
              overflow: 'hidden',
              borderRadius: '12px'
            }}>
              <iframe
                src={section.videoUrl}
                title={section.title}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </div>
          )}
        </section>
      );

    case 'card':
      return (
        <section style={{
          ...containerStyles,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '48px 32px',
          textAlign: 'center'
        }}>
          {section.title && <h2 style={titleStyles}>{section.title}</h2>}
          {section.content && (
            <div style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              lineHeight: '1.6'
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
            </div>
          )}
          {section.cardButtonText && section.cardButtonLink && (
            <a
              href={section.cardButtonLink}
              target={section.cardButtonLink.startsWith('http') ? '_blank' : '_self'}
              rel={section.cardButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                background: section.cardButtonStyle === 'secondary' ? '#6b7280' : '#003C69',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
            >
              {section.cardButtonText}
            </a>
          )}
        </section>
      );

    case 'key-value':
      let kvData = {};
      try {
        kvData = JSON.parse(section.content || '{}');
      } catch {
        kvData = {};
      }
      return (
        <section style={containerStyles}>
          {section.title && <h3 style={titleStyles}>{section.title}</h3>}
          <div style={{
            background: '#f9fafb',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            {Object.entries(kvData).map(([key, value], idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: idx < Object.entries(kvData).length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <strong style={{ color: '#374151' }}>{key}:</strong>
                <span style={{ color: '#6b7280' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'image':
      return (
        <section style={containerStyles}>
          {section.title && <h3 style={titleStyles}>{section.title}</h3>}
          {section.content && (
            <img 
              src={section.content} 
              alt={section.title || 'Section image'} 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }} 
            />
          )}
        </section>
      );

    case 'text':
    default:
      return (
        <section style={containerStyles}>
          {section.title && <h3 style={titleStyles}>{section.title}</h3>}
          <div style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: section.typography?.contentColor || '#333'
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content || ''}</ReactMarkdown>
          </div>
        </section>
      );
  }
};

// Main Home Component
export default function FlexibleHome() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://entyre-backend.onrender.com/api/markdown')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const sorted = Array.isArray(data) ? data.sort((a, b) => a.sectionIndex - b.sectionIndex) : [];
        setSections(sorted);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading content...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Please wait while we fetch the page content</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#dc2626' }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>Error loading content</div>
        <div style={{ fontSize: '14px' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '40px',maxWidth: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
        <BannerCarousel />
      </div>
      <div style={{ maxWidth: '95%', margin: '0 auto', padding: '0 20px' }}>
        {sections.map((section, idx) => (
          <DynamicSection key={section._id || idx} section={section} />
        ))}
      </div>
    </>
  );
}