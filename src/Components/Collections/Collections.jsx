import React, { useEffect, useState } from 'react'
import './Collections.css'
import Item from '../Item/Item'
import Pagination from '../Pagination/Pagination'
import { useCategory } from '../../Context/CategoryContext'
import { useSearch } from '../../Context/SearchContext'
import axios from '../../api/axios'

const Collections = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const { selectedCategory } = useCategory();
    const { searchQuery } = useSearch();
    
    // Hàm để xác định số lượng sản phẩm theo kích thước màn hình
    const getItemsPerPage = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 992 ? 50 : 20; // Large screen: 50, Small screen: 20
        }
        return 20; 
    };

    const [filters, setFilters] = useState({
        sortBy: 'CreatedAt',
        isDESC: true,
        priceRange: [0, 10000000],
        itemInPage: getItemsPerPage()
    });

    
    useEffect(() => {
        const handleResize = () => {
            const newItemInPage = getItemsPerPage();
            if (newItemInPage !== filters.itemInPage) {
                setFilters(prev => ({
                    ...prev,
                    itemInPage: newItemInPage
                }));
                setPage(1); 
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [filters.itemInPage]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`/api/Product/GetAll`, {
                params: {
                    productName: searchQuery || '',
                    isDESC: filters.isDESC,
                    page: page,
                    itemInPage: filters.itemInPage,
                    sortBy: filters.sortBy,
                    categoryId: selectedCategory || '',
                    minPrice: filters.priceRange[0],
                    maxPrice: filters.priceRange[1]
                }
            })
            setData(response.data.items);
            setTotalPages(response.data.pageSize);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
    }, [page, selectedCategory, searchQuery, filters]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(1);
    };

    const handlePriceRangeChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            priceRange: [
                name === 'minPrice' ? parseInt(value) || 0 : prev.priceRange[0],
                name === 'maxPrice' ? parseInt(value) || 10000000 : prev.priceRange[1]
            ]
        }));
        setPage(1);
    };

    const handleSortDirectionChange = () => {
        setFilters(prev => ({
            ...prev,
            isDESC: !prev.isDESC
        }));
        setPage(1);
    };

    const resolveImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };

    return (
        <div className="collections-container">
            <div className="collections all-product">
                <div className="collections-header">
                    <h3>
                        {selectedCategory ? `Sản phẩm theo danh mục` : 'Tất cả sản phẩm'}
                    </h3>
                </div>
                
                {/* Filter Section */}
                <div className="filters-section">
                    <div className="filter-group">
                        <label className="filter-label">Sắp xếp theo</label>
                        <select 
                            name="sortBy" 
                            className="filter-select"
                            value={filters.sortBy} 
                            onChange={handleFilterChange}
                        >
                            <option value="CreatedAt">Mới nhất</option>
                            <option value="Price">Giá</option>
                            <option value="Name">Tên</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Thứ tự</label>
                        <div className="sort-direction-toggle">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={filters.isDESC}
                                    onChange={handleSortDirectionChange}
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-text">
                                    {filters.isDESC ? 'Giảm dần' : 'Tăng dần'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="filter-group price-range-group">
                        <label className="filter-label">Khoảng giá</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                name="minPrice"
                                className="price-input pe-0"
                                placeholder="Từ"
                                value={filters.priceRange[0]}
                                onChange={handlePriceRangeChange}
                            />
                            <span className="price-separator">-</span>
                            <input
                                type="number"
                                name="maxPrice"
                                className="price-input pe-0"
                                placeholder="Đến"
                                value={filters.priceRange[1]}
                                onChange={handlePriceRangeChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="shop-product">
                    {data && data.length > 0 ? 
                        (data.map((item) => { 
                            const primaryImage = item.images.find(image => image.isPrimary); 
                            const imageLink = resolveImageUrl(primaryImage?.imageURL);

                            return <Item key={item.productID} id={item.productID} name={item.productName} price={item.price} image={imageLink} />; 
                        })) 
                        : (
                            <div className='noresult'>
                                <div className="no-result-content">
                                    <i className="fas fa-search no-result-icon"></i>
                                    <p className="no-result-text">Không tìm thấy sản phẩm nào</p>
                                    <p className="no-result-subtext">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}

export default Collections