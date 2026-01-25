import React, { useEffect, useState } from 'react'
import './Collections.css'
import Item from '../Item/Item'
import Pagination from '../Pagination/Pagination'
import { useCategory } from '../../Context/CategoryContext'
import { useSearch } from '../../Context/SearchContext'
import axios from '../../api/axios'
import { ArrowUpDown, ListFilter, CircleDollarSign } from 'lucide-react'

const Collections = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const { selectedCategory } = useCategory();
    const { searchQuery } = useSearch();
    const [currentCategory, setCurrentCategory] = useState(null);

    const getItemsPerPage = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 992 ? 50 : 20;
        }
        return 20;
    };

    const [filters, setFilters] = useState({
        sortBy: 'CreatedAt',
        isDESC: true,
        priceRange: [0, 10000000],
        itemInPage: getItemsPerPage()
    });

    const fetchCategoryDetail = async (categoryId) => {
        if (!categoryId) {
            setCurrentCategory(null);
            return;
        }

        try {
            const response = await axios.get(`/api/Category/${categoryId}`);
            setCurrentCategory(response.data);
        } catch (error) {
            console.error('Error fetching category details:', error);
            setCurrentCategory(null);
        }
    };

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
        fetchCategoryDetail(selectedCategory);
    }, [selectedCategory]);

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

    const resolveImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };

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

    return (
        <div className="collections-container">
            {/* Category Banner - CHIẾM TOÀN BỘ CHIỀU RỘNG */}
            {currentCategory && currentCategory.imageURL && (
                <div className="category-fullwidth-banner">
                    <div className="category-banner-image-container">
                        <img
                            src={resolveImageUrl(currentCategory.imageURL)}
                            alt={currentCategory.categoryName}
                            className="category-banner-image"
                        />
                        <div className="category-banner-overlay"></div>
                        <div className="category-banner-content">
                            <h1 className="category-banner-title">{currentCategory.categoryName}</h1>
                            {currentCategory.description && (
                                <p className="category-banner-description">{currentCategory.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="collections all-product">
                {/* Header Section - Modern Hero Style */}
                {(!currentCategory || !currentCategory.imageURL) && (
                    <div className="shop-hero-premium">
                        <div className="hero-background-patterns">
                            <div className="pattern-circle"></div>
                            <div className="pattern-dots"></div>
                        </div>
                        <div className="hero-content">
                            <span className="hero-subtitle">Discover our collection</span>
                            <h1 className="hero-title">
                                {selectedCategory && currentCategory
                                    ? currentCategory.categoryName
                                    : 'Tất cả sản phẩm'
                                }
                            </h1>
                            <div className="hero-divider-premium"></div>
                            <p className="hero-description">
                                Khám phá những dòng sản phẩm chất lượng cao được tuyển chọn khắt khe nhất dành riêng cho bạn.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filter Section */}
                <div className="filters-section">
                    <div className="filters-wrapper">
                        {/* Sort Select */}
                        <div className="filter-pill">
                            <div className="pill-icon"><ArrowUpDown size={16} /></div>
                            <div className="pill-content">
                                <span className="pill-label">Sắp xếp</span>
                                <select
                                    name="sortBy"
                                    className="pill-select"
                                    value={filters.sortBy}
                                    onChange={handleFilterChange}
                                >
                                    <option value="CreatedAt">Mới nhất</option>
                                    <option value="Price">Giá tiền</option>
                                    <option value="Name">Tên sản phẩm</option>
                                </select>
                            </div>
                        </div>

                        {/* Order Toggle */}
                        <div className="filter-pill clickable" onClick={handleSortDirectionChange}>
                            <div className="pill-icon"><ListFilter size={16} /></div>
                            <div className="pill-content">
                                <span className="pill-label">Thứ tự</span>
                                <span className="pill-value">
                                    {filters.isDESC ? 'Giảm dần' : 'Tăng dần'}
                                </span>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-pill price-pill">
                            <div className="pill-icon"><CircleDollarSign size={16} /></div>
                            <div className="pill-content">
                                <span className="pill-label">Khoảng giá</span>
                                <div className="pill-inputs">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Từ"
                                        value={filters.priceRange[0]}
                                        onChange={handlePriceRangeChange}
                                    />
                                    <span className="pill-sep">-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Đến"
                                        value={filters.priceRange[1]}
                                        onChange={handlePriceRangeChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shop-product">
                    {data && data.length > 0 ?
                        (data.map((item) => {
                            const primaryImage = item.images.find(image => image.isPrimary);
                            const secondaryImage = item.images.find(image => !image.isPrimary) || item.images[1];
                            const imageLink = resolveImageUrl(primaryImage?.imageURL);
                            const hoverImageLink = secondaryImage ? resolveImageUrl(secondaryImage.imageURL) : '';

                            return <Item key={item.productID} id={item.productID} name={item.productName} price={item.price} image={imageLink} hoverImage={hoverImageLink} />;
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

export default Collections;