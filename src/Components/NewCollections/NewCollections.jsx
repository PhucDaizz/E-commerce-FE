import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import axios from '../../api/axios'
import Item from '../Item/Item'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Navigation, Pagination } from 'swiper/modules';

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
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/Resources/${imageUrl}`;
    };


    return (
        <div className='newcollection'>
            <div className="title-newcollection d-flex">
                <h2 className='mt-5 d-flex justify-content-center'>Sản phẩm mới</h2>
                <hr className='custom-underline'/>
            </div>
            <div className="">
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[FreeMode, Pagination, Navigation]}
                    className="mySwiper"
                    breakpoints={{
                        // Mobile
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        // Tablet
                        576: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                        // Desktop
                        992: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        // Large desktop
                        1200: {
                            slidesPerView: 4,
                            spaceBetween: 2,
                        }
                    }}
                >
                    {
                        data.map((item,i) => {
                            const primaryImage = item.images.find(image => image.isPrimary);
                            const imageLink = primaryImage ? resolveImageUrl(primaryImage.imageURL) : '';
                            return (
                                <SwiperSlide key={i}>
                                    <Item id={item.productID} name={item.productName} price={item.price} image={imageLink}/>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default NewCollections