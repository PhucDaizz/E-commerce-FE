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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const {addToCart} = useAuth();

  const predefinedOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Hàm sắp xếp size
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

  useEffect(() => {
    if (colors.length > 0) { 
      setSelectedColor(colors[0]); }
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
        <div className="row">
          {/* Hình ảnh chính */}
          <div className="col-7 product-image">
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
                >
                  {images.map((item, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <img
                          src={`https://localhost:7295/Resources/${item.imageURL}`}
                          alt={`Product ${i}`}
                          className="img-fluid"
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
                    const imageLink = `https://localhost:7295/Resources/${item.imageURL}`;
                    return (
                      <SwiperSlide key={i}>
                        <img
                          src={imageLink}
                          alt={`Thumbnail ${i}`}
                          className="img-thumbnail"
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
          <div className="col-5 product-description p-4">
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
    </div>
  );
};

export default ProductDisplay;
