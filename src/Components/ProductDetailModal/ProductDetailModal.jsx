import React, { useState } from 'react';
import { useProduct } from '../../Context/ProductContext'; // Adjust import path as needed
import './ProductDetailModal.css'

const ProductDetailModal = ({ product, isOpen, toggle }) => {
    const { formatCurrency } = useProduct();

    if (!product) return null;

    return (
        <div>
            {/* Overlay background */}
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
                                {/* Images Section */}
                                <div className="col-md-5">
                                    <div id="productImageCarousel" className="carousel slide" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {product.images.map((image, index) => (
                                                <div
                                                    key={image.imageID}
                                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                                >
                                                    <img
                                                        src={`https://localhost:7295/Resources/${image.imageURL}`}
                                                        className="d-block w-100"
                                                        alt={`Product image ${index + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {product.images.length > 1 && (
                                            <>
                                                <button
                                                    className="carousel-control-prev"
                                                    type="button"
                                                    data-bs-target="#productImageCarousel"
                                                    data-bs-slide="prev"
                                                >
                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Previous</span>
                                                </button>
                                                <button
                                                    className="carousel-control-next"
                                                    type="button"
                                                    data-bs-target="#productImageCarousel"
                                                    data-bs-slide="next"
                                                >
                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Next</span>
                                                </button>
                                            </>
                                        )}
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
