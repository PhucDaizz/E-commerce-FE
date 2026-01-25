import React, { useEffect, useState, useRef } from 'react';
import './Hero.css';
import { useBannerContext } from '../../Context/BannerContext';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const Hero = () => {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const mountedRef = useRef(true);
  const { banners, getAllBanners, isLoading } = useBannerContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    const fetchBanners = async () => {
      try { await getAllBanners(); }
      catch (err) { console.error('Error loading banners:', err); }
    };
    fetchBanners();
    return () => { mountedRef.current = false; };
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
    setCurrentSlide((prev) => prev === activeBanners.length - 1 ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev === 0 ? activeBanners.length - 1 : prev - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (activeBanners.length > 1 && !isLoading) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length, isLoading]);

  if (isLoading) {
    return (
      <div className="hero-loading">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-banner">
      {activeBanners.length > 0 ? (
        <div id="fashionCarousel" className="carousel slide hero-carousel">
          {/* Indicators */}
          <div className="carousel-indicators">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                className={`indicator-btn ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {activeBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="banner-slide">
                  <div
                    className="banner-background"
                    style={{
                      backgroundImage: `url(${resolveImageUrl(banner.imageUrl)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="banner-overlay"></div>
                  </div>

                  <div className="banner-content">
                    <div className="container">
                      <div className="content-wrapper">
                        <h1 className="banner-title">{banner.title}</h1>
                        {banner.description && (
                          <p className="banner-description">{banner.description}</p>
                        )}
                        <div className="banner-actions">
                          <button className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-bold">
                            Khám phá ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {activeBanners.length > 1 && (
            <>
              <button className="carousel-control-prev" onClick={prevSlide}>
                <ChevronLeft color="white" size={32} />
              </button>
              <button className="carousel-control-next" onClick={nextSlide}>
                <ChevronRight color="white" size={32} />
              </button>
            </>
          )}
        </div>
      ) : (
        /* Default Fallback Slide */
        <div className="default-banner">
          <div className="banner-slide">
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

            <div className="banner-content">
              <div className="container">
                <div className="content-wrapper">
                  <h1 className="banner-title">Premium Fashion Store</h1>
                  <p className="banner-description">Khám phá phong cách thời trang dẫn đầu xu hướng cùng bộ sưu tập mới nhất.</p>
                  <button className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-bold d-flex align-items-center gap-2">
                    <ShoppingCart size={20} />
                    Mua sắm ngay
                  </button>
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