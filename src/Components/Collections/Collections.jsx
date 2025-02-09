import React, { useEffect, useState } from 'react'
import './Collections.css'
import Item from '../Item/Item'
import Pagination from '../Pagination/Pagination'
import { useCategory } from '../../Context/CategoryContext'
import { useSearch } from '../../Context/SearchContext'
import axios from '../../api/axios'

const Collections = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const { selectedCategory } = useCategory();
    const { searchQuery } = useSearch();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`/api/Product/GetAll`, {
                params: {
                    productName: searchQuery || '',
                    isDESC: true,
                    page: page,
                    itemInPage: 10,
                    sortBy: 'CreatedAt',
                    categoryId: selectedCategory || ''
                }
            })
            setData(response.data.items);
            setTotalPages(response.data.pageSize);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
    }, [page, selectedCategory, searchQuery] );

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
    <div>
        <div className="collections">
            <h3 className='d-flex justify-content-center'>
                {selectedCategory ? `Sản phẩm theo danh mục` : 'Tất cả sản phẩm'}
            </h3>
            <hr/>
            <div className="shop-product">
                { data && data.length > 0 ? 
                    ( data.map((item) => { 
                        const primaryImage = item.images.find(image => image.isPrimary); 
                        const imageLink = primaryImage ? `https://localhost:7295/Resources/${primaryImage.imageURL}` : ''; 
                        return <Item key={item.productID} id={item.productID} name={item.productName} price={item.price} image={imageLink} />; 
                    }) ) 
                    : ( <div className='noresult' style={{ gridColumn: '1 / -1' }}>
                        <p className='d-flex m-auto'>Không tìm thấy nội dung bạn yêu cầu</p> 

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
