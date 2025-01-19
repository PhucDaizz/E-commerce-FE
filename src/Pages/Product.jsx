import React, { useEffect, useState } from 'react'
import Breadcrum from '../Components/Breadcrum/Breadcrum'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import Review from '../Components/Review/Review'

const Product = () => {
  const {productId} = useParams();
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState({});
  const [images,  setImages] = useState([]);
  const [color, setColor] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    axios.get(`/api/Product/Detail/${productId}`)
    .then(res => {
      console.log(res.data)
      setCategory(res.data.category.categoryName)
      setProduct(res.data.product)
      setImages(res.data.images)
      setColor(res.data.color)
    })
    .catch(err => console.log(err))
    
    // call api review 
    axios.get(`/api/ProductReview/${productId}`)
    .then(rv => {
      console.log(rv.data)
      if (rv.data.length > 0) { 
        const totalRating = rv.data.reduce((acc, curr) => acc + curr.rating, 0); 
        const avgRating = totalRating / rv.data.length; 
        setAverageRating(avgRating); 
        setReviews(rv.data);
      }
    })
    .catch(err => console.log(err))
  },[productId])

  return (
    <div>
      <Breadcrum categoryname={category} productName={product.productName}/>
      <ProductDisplay images={images} product={product} colors={color} rating={averageRating}/>
      <Review reviews={reviews}/>
    </div>
  )
}

export default Product;