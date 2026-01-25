import React, { useEffect, useState } from 'react';
import './ProductDisplay.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import Rating from '../Rating/Rating';
import { useAuth } from '../../Context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { Heart, Minus, Plus, Share2, ShoppingBag } from 'lucide-react';

const ProductDisplay = ({ images = [], product = {}, colors = [], averageRating = 0, reviewsCount = 0 }) => {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useAuth();
  const predefinedOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  useEffect(() => {
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
    }
  }, [colors]);

  const sortSizes = (sizes) => {
    return [...sizes].sort((a, b) => {
      const indexA = predefinedOrder.indexOf(a.size.toUpperCase());
      const indexB = predefinedOrder.indexOf(b.size.toUpperCase());
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleSizeClick = (size) => {
    if (size.stock > 0) {
      setSelectedSize(size);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '0đ';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const onAddToCart = () => {
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước", { position: "bottom-right" });
      return;
    }
    addToCart(product, quantity, selectedSize, images, selectedColor);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết sản phẩm!", { position: "bottom-right" });
  };

  const currentImageUrl = (item) => {
    if (!item?.imageURL) return 'https://via.placeholder.com/600x800';
    return item.imageURL.includes("cloudinary.com") ? item.imageURL : `${apiUrl}/${item.imageURL}`;
  };

  return (
    <div className="product-display-premium">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="pd-container">
        <div className="pd-grid">
          {/* Gallery Section */}
          <div className="pd-gallery">
            <div className="main-swiper-container">
              <Swiper
                loop={images.length > 1}
                spaceBetween={10}
                navigation={images.length > 1}
                pagination={{ clickable: true, dynamicBullets: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                className="main-preview-swiper"
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
              >
                {images.length > 0 ? images.map((item, i) => (
                  <SwiperSlide key={i} onClick={() => setIsModalOpen(true)}>
                    <div className="aspect-ratio-box">
                      <img src={currentImageUrl(item)} alt={`${product.productName} - ${i}`} />
                    </div>
                  </SwiperSlide>
                )) : (
                  <SwiperSlide>
                    <div className="aspect-ratio-box">
                      <img src="https://via.placeholder.com/600x800" alt="No products" />
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            <div className="thumbs-swiper-container">
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={false}
                spaceBetween={12}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbnail-swiper"
              >
                {images.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="thumb-item">
                      <img src={currentImageUrl(item)} alt={`Thumb ${i}`} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Details Section */}
          <div className="pd-details">
            <div className="sticky-details">
              <div className="pd-header">
                <span className="pd-category-tag">BST Mới Nhất</span>
                <h1 className="pd-title">{product.productName}</h1>
                <div className="pd-meta">
                  <Rating rating={averageRating === 0 ? 5 : Math.round(averageRating)} />
                  <span className="pd-reviews-count">({reviewsCount} đánh giá)</span>
                </div>
                <div className="pd-price-row">
                  <h2 className="pd-price">{formatCurrency(product.price)}</h2>
                  {product.oldPrice && <span className="pd-old-price">{formatCurrency(product.oldPrice)}</span>}
                </div>
              </div>

              <div className="pd-selector-section">
                {/* Color Selector */}
                <div className="pd-selector">
                  <div className="selector-header">
                    <span className="selector-label">Màu sắc:</span>
                    <span className="selector-current">{selectedColor?.colorName}</span>
                  </div>
                  <div className="color-options">
                    {colors.map((color, i) => (
                      <button
                        key={i}
                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color.colorHex }}
                        onClick={() => handleColorClick(color)}
                        title={color.colorName}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                {selectedColor?.productSizes?.length > 0 && (
                  <div className="pd-selector">
                    <div className="selector-header">
                      <span className="selector-label">Kích thước:</span>
                      <span className="selector-current">{selectedSize?.size || 'Chọn size'}</span>
                    </div>
                    <div className="size-options">
                      {sortSizes(selectedColor.productSizes).map((size) => (
                        <button
                          key={size.productSizeID}
                          className={`size-btn ${selectedSize === size ? 'active' : ''} ${size.stock === 0 ? 'disabled' : ''}`}
                          onClick={() => handleSizeClick(size)}
                          disabled={size.stock === 0}
                        >
                          {size.size}
                        </button>
                      ))}
                    </div>
                    <button className="size-guide-link">Bảng size</button>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="pd-actions-row">
                  <div className="qty-picker">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                    <input type="text" value={quantity} readOnly />
                    <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                  </div>

                  <button
                    className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="pd-main-actions">
                  <button className="btn-add-cart" onClick={onAddToCart}>
                    <ShoppingBag size={20} />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button className="btn-share" onClick={handleShare} title="Sao chép liên kết">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="pd-info-tabs">
                <div className="info-tab">
                  <h4 className="info-tab-title">Mô tả sản phẩm</h4>
                  <p className="info-tab-content">{product.description || "Sản phẩm cao cấp với chất liệu thoáng mát, mang lại sự thoải mái tối đa cho người mặc."}</p>
                </div>
                <div className="pd-features">
                  <div className="feature-item">
                    <div className="feature-icon">🚚</div>
                    <span>Miễn phí vận chuyển cho đơn hàng từ 500k</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔄</div>
                    <span>Đổi trả dễ dàng trong vòng 30 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Image Modal */}
      {isModalOpen && (
        <div className="pd-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="pd-modal-content" onClick={e => e.stopPropagation()}>
            <button className="pd-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <Swiper
              initialSlide={currentImageIndex}
              navigation={true}
              modules={[Navigation]}
              className="pd-modal-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={currentImageUrl(img)} alt="Full view" className="full-modal-img" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
