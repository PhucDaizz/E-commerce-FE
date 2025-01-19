import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import axios from '../../api/axios'
import Item from '../Item/Item'
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Navigation, Pagination } from 'swiper/modules';

const NewCollections = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('/api/Product?isDESC=true&page=1&itemInPage=10&sortBy=CreatedAt')
        .then(res => setData(res.data.items))
        .catch(err => console.log(err))
    }, [])


    return (
    <div className=''>
        <div className="title-newcollection d-flex">
            <h2 className='mt-5 d-flex justify-content-center'>Năm mới sắm đồ mới</h2>
            <hr className='custom-underline'/> 
        </div>
        <div className="">
            <Swiper 
                spaceBetween={30} // Khoảng cách giữa các slide
                slidesPerView={3} // Số lượng sản phẩm hiển thị trên mỗi slide
                pagination={true} // Hiển thị pagination
                navigation= {true} 
                modules={[FreeMode, Pagination, Navigation]}
                className="mySwiper">
                {
                    data.map((item,i) => {
                        const primaryImage = item.images.find(image => image.isPrimary); 
                        const imageLink = primaryImage ? `https://localhost:7295/Resources/${primaryImage.imageURL}` : '';
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
