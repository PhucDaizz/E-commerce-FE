import React, { useState } from 'react';
import { useProduct } from '../../Context/ProductContext';
import { toast } from 'react-toastify'; // Thêm import toast
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

const ProductDetailModal = ({ product, isOpen, toggle, setListProduct }) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const { formatCurrency, deleteProduct } = useProduct();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            setIsDeleting(true);
            try {
                await deleteProduct(productId);
                
                setListProduct(prevData => ({
                    ...prevData,
                    items: prevData.items.filter(item => item.productID !== productId),
                    totalCount: prevData.totalCount - 1
                }));
                
                toast.success('Xóa sản phẩm thành công!');
                
                setTimeout(() => {
                    toggle();
                }, 1000); 
                
            } catch (error) {
                console.error('Error deleting product:', error);
                
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data || error.response.statusText;
                    
                    if (status === 400) {
                        toast.error(`Không thể xóa sản phẩm: ${message}`);
                    } else if (status === 404) {
                        toast.error('Sản phẩm không tồn tại!');
                    } else if (status === 403) {
                        toast.error('Bạn không có quyền xóa sản phẩm này!');
                    } else {
                        toast.error(`Lỗi server: ${message}`);
                    }
                } else if (error.request) {
                    toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
                } else {
                    toast.error('Xóa sản phẩm thất bại! Vui lòng thử lại.');
                }
            } finally {
                setIsDeleting(false);
            }
        }
    }

    if (!product) return null;

    return (
        <div className='product-dt-md'>
            {isOpen && <div className="modal-backdrop show" />}
            
            <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-lg-evenly">
                            <h5 className="modal-title">Chi tiết sản phẩm: {product.product.productName}</h5>
                             <button 
                                className={`delete-btn ${isDeleting ? 'deleting' : ''} ms-3`}
                                onClick={() => handleDeleteProduct(product.product.productID)}
                                disabled={isDeleting}
                                title="Xóa sản phẩm"
                            >
                                {isDeleting ? (
                                    <i className="bi bi-hourglass-split"></i>
                                ) : (
                                    <i className="bi bi-trash3"></i>
                                )}
                            </button>
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
                                                        src={
                                                            image.imageURL
                                                            ? image.imageURL.includes("cloudinary.com")
                                                                ? image.imageURL
                                                                : `${apiUrl}/Resources/${image.imageURL}`
                                                            : 'https://via.placeholder.com/80x80?text=No+Image'
                                                        }
                                                        
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
                                                        src={
                                                            image.imageURL
                                                            ? image.imageURL.includes("cloudinary.com")
                                                                ? image.imageURL
                                                                : `${apiUrl}/Resources/${image.imageURL}`
                                                            : 'https://via.placeholder.com/80x80?text=No+Image'
                                                        }
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