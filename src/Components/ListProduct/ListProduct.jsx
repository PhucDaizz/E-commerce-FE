import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import { useCategory } from '../../Context/CategoryContext';
import { useProduct } from '../../Context/ProductContext';
import { Link } from 'react-router-dom';
import DetailProduct from '../ProductDetailModal/ProductDetailModal';
import Pagination from '../Pagination/Pagination'; // Assuming Pagination is in the same directory
import ProductDetailModal from '../ProductDetailModal/ProductDetailModal';
import { toast, ToastContainer } from 'react-toastify';

const ListProduct = () => {
    const { getCategory, categories } = useCategory();
    const { getAllProductAdmin, listProduct, formatCurrency, getDetailProduct, changeStatusProduct, setListProduct } = useProduct();

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        getCategory();
    }, []);

    // Fetch products when page, items per page, or category changes
    useEffect(() => {
        getAllProductAdmin(currentPage, itemsPerPage, null, selectedCategory);
    }, [currentPage, itemsPerPage, selectedCategory]);

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = Number(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        setCurrentPage(1); // Reset to first page when changing category
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCheckboxChange = async (productID) => {
        // Optimistic UI update - cập nhật UI ngay lập tức
        setListProduct(prevData => ({
            ...prevData,
            items: prevData.items.map(product =>
                product.productID === productID 
                    ? { ...product, isPublic: !product.isPublic } 
                    : product
            )
        }));
    
        try {
            // Gọi API để cập nhật trạng thái
            const response = await changeStatusProduct(productID);
            
            if (response.status === 200) {
                toast.success('Cập nhật trạng thái thành công');
            } else {
                // Nếu API thất bại, hoàn tác UI về trạng thái cũ
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
            // Nếu có lỗi, hoàn tác UI về trạng thái cũ
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
        <div className='list-product border shadow-sm mt-3 p-3'>
            <ToastContainer/>
            <div className="row container mt-2 align-items-center">
                <div className="col-7 d-flex align-items-center">
                    <label htmlFor='hide' className='me-2 mb-0 w-25'>Hiển thị</label>
                    <select 
                        id='hide' 
                        name='hide' 
                        className='form-select d-inline-block w-auto me-2' 
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>

                    <label htmlFor='category' className='ms-3 me-1 mb-0 w-25'>Loại SP</label>
                    <select 
                        id='category' 
                        name='category' 
                        className='form-select d-inline-block w-auto' 
                        value={selectedCategory || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All</option>
                        {categories.map((item) => (
                            <option key={item.categoryID} value={item.categoryID}>
                                {item.categoryName}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="find" className='ms-4 me-2 mb-0'>Mục</label>
                    <input 
                        id='find' 
                        name='find' 
                        type="text" 
                        className='form-control d-inline-block w-50' 
                        placeholder='Tìm kiếm...' 
                    />
                    <button className="btn btn-outline-secondary ms-2">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <div className="col text-end btn-add">
                    <Link to={'/admin/products/add'} className='btn-link'>
                        <button className='btn btn-outline-primary'>
                            <i className="bi bi-plus"></i> Thêm mới
                        </button>
                    </Link>
                </div>
            </div>

            <div className="product-list mt-3 bg-light">
                <div className="row d-flex align-content-center">
                    <div className="col-5">Sản phẩm</div>
                    <div className="col">Mã sản phẩm</div>
                    <div className="col">Giá</div>
                    <div className="col">Số lượng</div>
                    <div className="col d-flex justify-content-center">Thao tác</div>
                    <div className="col-1">Công khai</div>
                </div>
            </div>

            <table className="product-list mt-2 table table-hover">
                <tbody>
                    {listProduct.items && listProduct.items.map((product) => (
                        <tr key={product.productID} className="row mb-2 p-2 product-item">
                            <div className="col-5">
                                <img 
                                    src={`https://localhost:7295/Resources/${product.images[0].imageURL}`} 
                                    alt="" 
                                    className='img-fluid me-1'
                                />
                                {product.productName}
                            </div>
                            <div className="col d-flex align-items-center">{product.productID}</div>
                            <div className="col d-flex align-items-center">{formatCurrency(product.price)}</div>
                            <div className="col">{/* Số lượng */}</div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <i 
                                    className="bi bi-eye text-info fs-6 me-1 cursor-pointer"
                                    onClick={() => handleViewProduct(product.productID)}
                                ></i>
                                <Link to={`/admin/products/edit/${product.productID}`}>
                                    <i className="bi bi-pencil-fill text-success fs-6 me-1" onClick={<DetailProduct/>}></i>
                                </Link>
                                <i className="bi bi-trash3 text-danger fs-6"></i>
                            </div>
                            <div className="col-1">
                                <div className="form-check form-switch ">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch" 
                                        id="flexSwitchCheckDefault"
                                        checked={product.isPublic}
                                        onChange={() => handleCheckboxChange(product.productID)}
                                    />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                        
                                    </label>
                                </div>
                            </div>

                        </tr>
                    ))}

                </tbody>
            </table>
            <hr />
            {/* Pagination component */}
            <div className="d-flex justify-content-center mt-3">
                <Pagination 
                    currentPage={listProduct.page} 
                    totalPages={listProduct.pageSize} 
                    onPageChange={handlePageChange}
                />
            </div>

            <ProductDetailModal 
                product={selectedProduct}
                isOpen={isModalOpen}
                toggle={toggleModal}
            />
        </div>
    );
}

export default ListProduct;