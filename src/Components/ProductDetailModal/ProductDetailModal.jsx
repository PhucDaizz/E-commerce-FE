import React, { useState } from 'react';
import { useProduct } from '../../Context/ProductContext';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// Import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, isOpen, toggle }) => {
    const { formatCurrency } = useProduct();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    if (!product) return null;

    return (
        <div className='product-dt-md'>
            {isOpen && <div className="modal-backdrop show" />}
            
            <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-lg-evenly">
                            <h5 className="modal-title">Chi tiết sản phẩm: {product.product.productName}</h5>
                            <button type="button" className="close btn btn-lg" onClick={toggle} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {/* Images Section with Swiper */}
                                <div className="col-md-5">
                                    <div className="product-images-slider">
                                        <Swiper
                                            style={{
                                                '--swiper-navigation-color': '#000',
                                                '--swiper-pagination-color': '#000',
                                            }}
                                            spaceBetween={10}
                                            navigation={true}
                                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="mySwiper2"
                                        >
                                            {product.images.map((image) => (
                                                <SwiperSlide key={image.imageID}>
                                                    <img
                                                        src={`https://localhost:7295/Resources/${image.imageURL}`}
                                                        alt={`Product view ${image.imageID}`}
                                                        style={{ width: '100%', height: 'auto' , position: 'absolute', top: '0px'}}
                                                        
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {/* Thumbnail Swiper */}
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            spaceBetween={10}
                                            slidesPerView={4}
                                            freeMode={true}
                                            watchSlidesProgress={true}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="mySwiper mt-3"
                                        >
                                            {product.images.map((image) => (
                                                <SwiperSlide key={image.imageID}>
                                                    <img
                                                        src={`https://localhost:7295/Resources/${image.imageURL}`}
                                                        alt={`Thumbnail ${image.imageID}`}
                                                        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>

                                {/* Product Details Section */}
                                <div className="col-md-7">
                                    <h4>{product.product.productName}</h4>
                                    <p className="text-muted">Mã sản phẩm: {product.product.productID}</p>

                                    <div className="mb-3">
                                        <strong>Giá:</strong> {formatCurrency(product.product.price)}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Loại sản phẩm:</strong> {product.category.categoryName}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Mô tả:</strong>
                                        <p>{product.product.description}</p>
                                    </div>

                                    {/* Colors and Sizes Section */}
                                    <div className="mb-3">
                                        <strong>Màu sắc và số lượng:</strong>
                                        {product.color.map((color) => (
                                            <div key={color.productColorID} className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="color-box me-2"
                                                        style={{
                                                            backgroundColor: color.colorHex,
                                                            width: '20px',
                                                            height: '20px',
                                                            border: '1px solid #ddd'
                                                        }}
                                                    />
                                                    {color.colorName}
                                                </div>
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Size</th>
                                                            <th>Số lượng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {color.productSizes.map((size) => (
                                                            <tr key={size.productSizeID}>
                                                                <td>{size.size}</td>
                                                                <td>{size.stock}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;