// import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Item from '../Item/Item';
import Pagination from '../Pagination/Pagination';
import axios from '../../api/axios';

export const AllProduct = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Product/GetAll`, {
                    params: {
                        isDESC: true,
                        page: page,
                        itemInPage: 10,
                        sortBy: 'CreatedAt'
                    }
                })
    
                setData(response.data.items);
                setTotalPages(response.data.pageSize);
            }
            catch(err) {
                console.error('Error fetching data:', err);
            }
        }

        fetchData();

    },[page])

    return (
        <div className='all-product'>
            <h3 className='d-flex justify-content-center'>
                Tất cả sản phẩm
            </h3>
            <div className='shop-product'>
                {
                    data.map((item) => {
                        const primaryImage = item.images.find(image => image.isPrimary); 
                        const imageLink = primaryImage ? `https://localhost:7295/Resources/${primaryImage.imageURL}` : ''; 
                        return <Item key={item.productID} id={item.productID} name={item.productName} price={item.price} image={imageLink} ></Item>
                    })
                }
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange}></Pagination>
        </div>
    )
}
