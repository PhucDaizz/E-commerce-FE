import React, { useEffect, useState } from 'react';
import './ProductDisplay.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Rating from '../Rating/Rating';
import { useAuth } from '../../Context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const ProductDisplay = ({ images = [], product = {}, colors = [], averageRating = 0 }) => {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalSwiper, setModalSwiper] = useState(null);
  const {addToCart} = useAuth();

  const predefinedOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Hàm sắp xếp size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const sortSizes = (sizes) => {
    return sizes.sort((a, b) => {
      const indexA = predefinedOrder.indexOf(a.size.toUpperCase());
      const indexB = predefinedOrder.indexOf(b.size.toUpperCase());
      return indexA - indexB;
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

  const handleQuantityChange = (increment) => { 
    setQuantity((prevQuantity) => { 
      const newQuantity = prevQuantity + increment; 
      return newQuantity > 0 ? newQuantity : 1; 
    }); 
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (colors.length > 0) { 
      setSelectedColor(colors[0]); 
    }
  }, [colors])

  function formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '0đ';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  }

  const handleAddToCart = (product, quantity, selectedSize) => {
    if( quantity <= selectedSize.stock) {
      addToCart(product.productID, quantity, selectedSize.productSizeID);
    }
    else{
      toast.error("Xin lỗi bạn số lượng trong kho không đủ 😓")
    }
  }

  return (
    <div className="productDisplay">
      <div className="container">
        <div className={`row ${isMobile ? 'mobile-layout' : ''}`}>
          {/* Hình ảnh chính */}
          <div className={`${isMobile ? 'col-12' : 'col-7'} product-imagee`}>
            {images.length > 0 ? (
              <>
                {/* Swiper cho hình ảnh lớn */}
                <Swiper
                  style={{
                    '--swiper-navigation-color': 'f8f8f8',
                    '--swiper-pagination-color': '#fff',
                  }}
                  loop={images.length > 1}
                  spaceBetween={10}
                  navigation={images.length > 1}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper2"
                  onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
                >
                  {images.map((item, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <img
                          src={
                            item.imageURL
                            ? item.imageURL.includes("cloudinary.com")
                                ? item.imageURL
                                : `${apiUrl}/${item.imageURL}`
                            : 'https://via.placeholder.com/60'
                          }
                          
                          alt={`Product ${i}`}
                          className="img-fluid clickable-image"
                          onClick={() => handleImageClick(i)}
                          style={{ cursor: 'pointer' }}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {/* Swiper cho hình ảnh thu nhỏ */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={images.length > 1}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper"
                >
                  {images.map((item, i) => {
                    const imageLink = item.imageURL
                        ? item.imageURL.includes("cloudinary.com")
                            ? item.imageURL
                            : `${apiUrl}/${item.imageURL}`
                        : 'https://via.placeholder.com/80x80?text=No+Image'
                    return (
                      <SwiperSlide key={i}>
                        <img
                          src={imageLink}
                          alt={`Thumbnail ${i}`}
                          className="img-thumbnail clickable-thumbnail"
                          onClick={() => handleImageClick(i)}
                          style={{ cursor: 'pointer' }}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </>
            ) : (
              <p>No images available</p>
            )}
          </div>

          {/* Mô tả sản phẩm */}
          <div className={`${isMobile ? 'col-12' : 'col-5'} product-description ${isMobile ? 'mobile-description' : 'p-4'}`}>
            <p className='product-name'>{product.productName}</p>
            
            <Rating rating = {averageRating === 0 ? 5 : Math.round(averageRating)} />

            <p className='product-price'>{formatCurrency(product.price)}</p>
            <p>Màu sắc</p>
            <div className="product-color d-flex">
              {colors.map((color, i) => (
                  <div 
                    key={i}
                    className={`color-circle ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color.colorHex }} 
                    onClick={() => handleColorClick(color)}
                  ></div>
                ))}
            </div>

            {selectedColor?.productSizes?.length > 0 && ( 
              <div className="product-sizes"> 
                {sortSizes(selectedColor.productSizes).map((size) => ( 
                  <button 
                    key={`${selectedColor.colorID}-${size.productSizeID}-${size.size}`} 
                    className={`size-button ${size.stock === 0 ? 'out-of-stock' : ''} ${selectedSize === size ? 'selected' : ''}`} 
                    onClick={() => handleSizeClick(size)}
                    disabled={size.stock === 0} > 
                      {size.size} 
                  </button> 
                ))} 
              </div> 
            )}

            {/* Số lượng mua */}
            <div className="quantity-selector d-flex"> 
              <button onClick={() => handleQuantityChange(-1)}>-</button> 
              <input type="text" value={quantity} readOnly className='justify-content-center' /> 
              <button onClick={() => handleQuantityChange(1)}>+</button> 
            </div>

            <button className='add-to-cart' onClick={() => handleAddToCart(product, quantity, selectedSize)}><span>THÊM VÀO GIỎ</span></button>
            <ToastContainer/>
            <p>{product?.description || 'No description available'}</p>
          </div>
        </div>
      </div>

      {/* Modal Full Screen */}
      {isModalOpen && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <Swiper
              onSwiper={setModalSwiper}
              initialSlide={currentImageIndex}
              loop={images.length > 1}
              spaceBetween={10}
              navigation={images.length > 1}
              modules={[Navigation]}
              className="modal-swiper"
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-navigation-size': '30px',
              }}
            >
              {images.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="modal-image-container">
                    <img
                      src={
                          item.imageURL
                          ? item.imageURL.includes("cloudinary.com")
                              ? item.imageURL
                              : `${apiUrl}/${item.imageURL}`
                          : 'https://via.placeholder.com/80x80?text=No+Image'
                      }
                      alt={`Product ${i}`}
                      className="modal-image"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="modal-image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;