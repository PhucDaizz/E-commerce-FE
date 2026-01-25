import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import axios from '../../api/axios'
import Item from '../Item/Item'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';

const NewCollections = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('/api/Product/GetAll?isDESC=true&page=1&itemInPage=10&sortBy=CreatedAt')
            .then(res => setData(res.data.items))
            .catch(err => console.log(err))
    }, [])

    const resolveImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };

    return (
        <div className='new-collections-premium'>
            <div className="container">
                <div className="collections-header-group">
                    <span className="collections-subtitle">Curated for you</span>
                    <h2 className='collections-title'>Bộ sưu tập mới</h2>
                </div>

                <div className="collections-slider-wrapper">
                    <Swiper
                        spaceBetween={24}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[FreeMode, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            }
                        }}
                    >
                        {data.map((item, i) => {
                            const primaryImage = item.images.find(image => image.isPrimary);
                            const secondaryImage = item.images.find(image => !image.isPrimary) || item.images[1];
                            const imageLink = primaryImage ? resolveImageUrl(primaryImage.imageURL) : '';
                            const hoverImageLink = secondaryImage ? resolveImageUrl(secondaryImage.imageURL) : '';
                            return (
                                <SwiperSlide key={i}>
                                    <Item
                                        id={item.productID}
                                        name={item.productName}
                                        price={item.price}
                                        image={imageLink}
                                        hoverImage={hoverImageLink}
                                    />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default NewCollections