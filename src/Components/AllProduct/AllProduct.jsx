import React, { useEffect, useState } from 'react'
import Item from '../Item/Item';
import Pagination from '../Pagination/Pagination';
import axios from '../../api/axios';
import './AllProduct.css'

export const AllProduct = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const apiUrl = import.meta.env.VITE_BASE_API_URL;

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({
            top: document.querySelector('.all-product-header')?.offsetTop - 100,
            behavior: 'smooth'
        });
    };

    const resolveImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Product/GetAll`, {
                    params: {
                        isDESC: true,
                        page: page,
                        itemInPage: 20,
                        sortBy: 'CreatedAt'
                    }
                })

                setData(response.data.items);
                setTotalPages(response.data.pageSize);
            }
            catch (err) {
                console.error('Error fetching data:', err);
            }
        }

        fetchData();
    }, [page])

    return (
        <div className='all-product-premium'>
            <div className="container">
                {/* Banner Section */}
                <div className="all-product-banner-wrapper">
                    <img src='https://res.cloudinary.com/dwuetxxnt/image/upload/v1757147289/Gemini_Generated_Image_36osfa36osfa36os_xinakz.png' alt='All Collections' />
                </div>

                {/* Header Section */}
                <div className="all-product-header">
                    <span className="all-product-subtitle">Explore everything</span>
                    <h2 className='all-product-title'>Tất cả sản phẩm</h2>
                </div>

                {/* Products Grid */}
                <div className='all-product-grid'>
                    {data.map((item) => {
                        const primaryImage = item.images.find(image => image.isPrimary);
                        const secondaryImage = item.images.find(image => !image.isPrimary) || item.images[1];
                        const imageLink = primaryImage ? resolveImageUrl(primaryImage.imageURL) : '';
                        const hoverImageLink = secondaryImage ? resolveImageUrl(secondaryImage.imageURL) : '';

                        return (
                            <Item
                                key={item.productID}
                                id={item.productID}
                                name={item.productName}
                                price={item.price}
                                image={imageLink}
                                hoverImage={hoverImageLink}
                            />
                        )
                    })}
                </div>

                {/* Pagination Section */}
                <div className="all-product-pagination">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}
