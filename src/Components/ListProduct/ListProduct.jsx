import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import { useCategory } from '../../Context/CategoryContext';
import { useProduct } from '../../Context/ProductContext';
import { Link } from 'react-router-dom';
import DetailProduct from '../ProductDetailModal/ProductDetailModal';
import Pagination from '../Pagination/Pagination';
import ProductDetailModal from '../ProductDetailModal/ProductDetailModal';
import { toast, ToastContainer } from 'react-toastify';

const ListProduct = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const { getCategory, categories } = useCategory();
    const { getAllProductAdmin, listProduct, formatCurrency, getDetailProduct, changeStatusProduct, setListProduct, pauseSaleProduct } = useProduct();

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchProduct, setSearchProduct] = useState(null);
    const [clickSearch, setClickSearch] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        getCategory();
    }, []);

    // Fetch products when page, items per page, or category changes
    useEffect(() => {
        getAllProductAdmin(currentPage, itemsPerPage, null, selectedCategory, searchProduct);
    }, [currentPage, itemsPerPage, selectedCategory, clickSearch]);

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = Number(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleViewProduct = async (productID) => {
        try {
            const productDetail = await getDetailProduct(productID);
            setSelectedProduct(productDetail);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handlePauseSaleProduct = async (productId) => {
        try {
            const product = await pauseSaleProduct(productId);
            console.log(product);
        } catch (error) {
            console.error('Error pausale product:', error);
        }
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setClickSearch(!clickSearch)
        }
    }

    const handleCheckboxChange = async (productID) => {
        // Optimistic UI update
        setListProduct(prevData => ({
            ...prevData,
            items: prevData.items.map(product =>
                product.productID === productID 
                    ? { ...product, isPublic: !product.isPublic } 
                    : product
            )
        }));
    
        try {
            const response = await changeStatusProduct(productID);
            
            if (response.status === 200) {
                toast.success('Cập nhật trạng thái thành công');
            } else {
                setListProduct(prevData => ({
                    ...prevData,
                    items: prevData.items.map(product =>
                        product.productID === productID 
                            ? { ...product, isPublic: !product.isPublic } 
                            : product
                    )
                }));
                toast.error("Cập nhật trạng thái thất bại!");
            }
        } catch (error) {
            setListProduct(prevData => ({
                ...prevData,
                items: prevData.items.map(product =>
                    product.productID === productID 
                        ? { ...product, isPublic: !product.isPublic } 
                        : product
                )
            }));
            toast.error("Lỗi khi cập nhật trạng thái!");
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };

    return (
        <div className='modern-product-list'>
            <ToastContainer/>
            
            {/* Header Section */}
            <div className="product-header card-header">
                <div className="header-title">
                    <h2 className="page-title">
                        <i className="bi bi-box-seam me-2"></i>
                        Quản lý sản phẩm
                    </h2>
                    <p className="page-subtitle">Danh sách và quản lý tất cả sản phẩm</p>
                </div>
                <Link to={'/admin/products/add'} className='add-product-btn'>
                    <button className='btn-primary btn-modern'>
                        <i className="bi bi-plus-circle me-2"></i>
                        Thêm sản phẩm mới
                    </button>
                </Link>
            </div>

            {/* Filters Section */}
            <div className="filters-card">
                <div className="filters-row">
                    <div className="filter-group">
                        <label className="filter-label">
                            <i className="bi bi-list-ul me-1"></i>
                            Hiển thị
                        </label>
                        <select 
                            className='form-select select-modern' 
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value="10">10 sản phẩm</option>
                            <option value="20">20 sản phẩm</option>
                            <option value="30">30 sản phẩm</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">
                            <i className="bi bi-tag me-1"></i>
                            Danh mục
                        </label>
                        <select 
                            className='form-select select-modern' 
                            value={selectedCategory || ''}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((item) => (
                                <option key={item.categoryID} value={item.categoryID}>
                                    {item.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group search-group">
                        <label className="filter-label">
                            <i className="bi bi-search me-1"></i>
                            Tìm kiếm
                        </label>
                        <div className="search-container">
                            <input 
                                type="text" 
                                className='form-control search-input' 
                                placeholder='Nhập tên sản phẩm, mã sản phẩm...' 
                                onChange={(e) => setSearchProduct(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button 
                                className="btn search-btn " 
                                onClick={() => setClickSearch(!clickSearch)}
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="products-table-container">
                <div className="table-header" style={{display: 'flex'}}>
                    <div className="table-stats">
                        <span className="total-items text-white fw-bold">
                            <i className="bi bi-archive me-1"></i>
                            Tổng cộng:  <strong className='ps-1 pe-1'>{listProduct.totalCount || 0}</strong> sản phẩm
                        </span>
                    </div>
                </div>

                <div className="modern-table">
                    <div className="table-header-row">
                        <div className="col-product">Sản phẩm</div>
                        <div className="col-id">Mã SP</div>
                        <div className="col-price">Giá bán</div>
                        <div className="col-quantity">Số lượng</div>
                        <div className="col-actions">Thao tác</div>
                        <div className="col-status">Trạng thái</div>
                    </div>

                    <div className="table-body">
                        {listProduct.items && listProduct.items.length > 0 ? (
                            listProduct.items.map((product) => (
                                <div key={product.productID} className="product-row">
                                    <div className="col-product">
                                        <div className="product-info">
                                            <div className="product-image">
                                                <img 
                                                    src={
                                                        product.images?.[0]?.imageURL
                                                        ? product.images[0].imageURL.includes("cloudinary.com")
                                                            ? product.images[0].imageURL
                                                            : `${apiUrl}/${product.images[0].imageURL}`
                                                        : 'https://via.placeholder.com/80x80?text=No+Image'
                                                    }
                                                    alt={product.productName}
                                                    className='product-img'
                                                />
                                            </div>
                                            <div className="product-details">
                                                <h6 className="product-name" 
                                                >{product.productName}</h6>
                                                <span className="product-category">
                                                    {categories.find(cat => cat.categoryID === product.categoryID)?.categoryName || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-id">
                                        <span className="product-id">#{product.productID}</span>
                                    </div>
                                    
                                    <div className="col-price">
                                        <span className="price-value">{formatCurrency(product.price)}</span>
                                    </div>
                                    
                                    <div className="col-quantity">
                                        <span className="quantity-badgee">{product.totalQuantity}</span>
                                    </div>
                                    
                                    <div className="col-actions">
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn view-btn"
                                                onClick={() => handleViewProduct(product.productID)}
                                                title="Xem chi tiết"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <Link to={`/admin/products/edit/${product.productID}`}>
                                                <button className="action-btn edit-btn" title="Chỉnh sửa">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            </Link>
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handlePauseSaleProduct(product.productID)}
                                                title="Tạm ngưng bán"
                                            >
                                                <i className="bi bi-pause-circle"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="col-status">
                                        <div className="status-toggle">
                                            <label className="switch">
                                                <input 
                                                    type="checkbox"
                                                    checked={product.isPublic}
                                                    onChange={() => handleCheckboxChange(product.productID)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <span className={`status-text ${product.isPublic ? 'active' : 'inactive'}`}>
                                                {product.isPublic ? 'Công khai' : 'Ẩn'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <i className="bi bi-inbox"></i>
                                </div>
                                <h5>Không có sản phẩm nào</h5>
                                <p>Hiện tại chưa có sản phẩm nào trong danh sách</p>
                                <Link to={'/admin/products/add'}>
                                    <button className="btn btn-primary">
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Thêm sản phẩm đầu tiên
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {listProduct.items && listProduct.items.length > 0 && (
                <div className="pagination-container">
                    <Pagination 
                        currentPage={listProduct.page} 
                        totalPages={listProduct.pageSize} 
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <ProductDetailModal 
                product={selectedProduct}
                isOpen={isModalOpen}
                toggle={toggleModal}
                setListProduct={setListProduct}
            />
        </div>
    );
}

export default ListProduct;