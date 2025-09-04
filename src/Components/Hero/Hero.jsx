import React, { useEffect, useState, useRef } from 'react';
import './Hero.css';
import { useBannerContext } from '../../Context/BannerContext';

const Hero = () => {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const mountedRef = useRef(true);
  const { banners, getAllBanners, isLoading, error } = useBannerContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    
    const fetchBanners = async () => {
      try {
        await getAllBanners();
      } catch (err) {
        console.error('Error loading banners:', err);
      }
    };
    
    fetchBanners();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getActiveBanners = () => {
    const now = new Date();
    return banners.filter(banner => 
      banner.isActive && 
      new Date(banner.startDate) <= now && 
      (!banner.endDate || new Date(banner.endDate) >= now)
    );
  };

  const resolveImageUrl = (imageUrl) => {
      if (!imageUrl) return '';
      return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
  };

  const activeBanners = getActiveBanners();

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === activeBanners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide effect with cleanup
  useEffect(() => {
    if (activeBanners.length > 1 && !isLoading) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length, isLoading]);

  // Reset current slide when banners change
  useEffect(() => {
    if (activeBanners.length > 0 && currentSlide >= activeBanners.length) {
      setCurrentSlide(0);
    }
  }, [activeBanners.length, currentSlide]);

  if (isLoading) {
    return (
      <div className="hero-loading">
        <div className="banner-slide position-relative">
          <div 
            className="banner-background"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="banner-overlay"></div>
          </div>
          
          <div className="banner-content position-absolute">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 text-center">
                  <div className="content-wrapper">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <div className="spinner-border text-light mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Đang tải banner...</span>
                      </div>
                      <h3 className="text-white mb-0">Đang tải banner...</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-error">
        <div className="banner-slide position-relative">
          <div 
            className="banner-background"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            }}
          >
            <div className="banner-overlay"></div>
          </div>
          
          <div className="banner-content position-absolute">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                  <div className="content-wrapper">
                    <h2 className="text-white mb-3">Oops! Có lỗi xảy ra</h2>
                    <p className="text-white-50 mb-4">{error}</p>
                    <button 
                      className="btn btn-light btn-lg"
                      onClick={() => window.location.reload()}
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-banner">
      {activeBanners.length > 0 ? (
        <div id="fashionCarousel" className="carousel slide hero-carousel" data-bs-ride="carousel">
          {/* Carousel Indicators */}
          {activeBanners.length > 1 && (
            <div className="carousel-indicators">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`indicator-btn ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Carousel Inner */}
          <div className="carousel-inner">
            {activeBanners.map((banner, index) => (
              <div 
                key={banner.id} 
                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
              >
                {/* <a 
                  href={banner.redirectUrl} 
                  className="banner-link text-decoration-none"
                > */}
                  <div className="banner-slide position-relative">
                    <div 
                      className="banner-background"
                      style={{
                        backgroundImage: `url(${resolveImageUrl(banner.imageUrl)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      <div className="banner-overlay"></div>
                    </div>
                    
                    <div className="banner-content position-absolute">
                      <div className="container">
                        <div className="row justify-content-center justify-content-lg-start">
                          <div className="col-12 col-lg-6">
                            <div className="content-wrapper">
                              <h1 className="banner-title">{banner.title}</h1>
                              {banner.description && (
                                <p className="banner-description">{banner.description}</p>
                              )}
                              <div className="banner-actions">
                                <button className="btn btn-primary btn-lg me-3">
                                  Mua Ngay
                                </button>
                                <button className="btn btn-outline-light btn-lg">
                                  Xem Thêm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* </a> */}
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          {activeBanners.length > 1 && (
            <>
              <button 
                className="carousel-control-prev"
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <span className="carousel-control-prev-icon">
                  {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
                </span>
              </button>
              <button 
                className="carousel-control-next"
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <span className="carousel-control-next-icon">
                  {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
                </span>
              </button>
            </>
          )}
        </div>
      ) : (
        // Fallback banner khi không có banner active
        <div className="default-banner">
          <div className="banner-slide position-relative">
            <div 
              className="banner-background"
              style={{
                backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/008/174/590/non_2x/fashion-advertising-web-banner-illustration-vector.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="banner-overlay"></div>
            </div>
            
            <div className="banner-content position-absolute">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-12 col-lg-6 text-center">
                    <div className="content-wrapper">
                      <h1 className="banner-title">Chào Mừng Đến Cửa Hàng</h1>
                      <p className="banner-description">Khám phá bộ sưu tập thời trang độc đáo của chúng tôi</p>
                      <div className="banner-actions">
                        <button className="btn btn-primary btn-lg me-3">
                          Khám Phá Ngay
                        </button>
                        <button className="btn btn-outline-light btn-lg">
                          Liên Hệ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;