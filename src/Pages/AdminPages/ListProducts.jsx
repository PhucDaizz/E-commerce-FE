import React, { useState } from 'react'
import ListProduct from '../../Components/ListProduct/ListProduct'
import axios from '../../api/axios';

const ListProducts = () => {
    const [data, setDate] = useState([]);

    const fetchData = async ( ) => {
        try {
            const response = await axios.get(`/api/Product/GetAll` , {
                params: {
                    productName: searchQuery || '',
                    isDESC: true,
                    page: page,
                    itemInPage: 5,
                    sortBy: 'CreatedAt',
                    categoryId: selectedCategory || ''
                }
            })
        } catch(error){
            console.error('Error fetching data:', error);
        }
    }
    


    return (
        <div className='list-products container'>
        <ListProduct/>
        </div>
    )
}

export default ListProducts
