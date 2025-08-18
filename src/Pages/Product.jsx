// Product.js
import React, { useEffect, useState } from 'react'
import Breadcrum from '../Components/Breadcrum/Breadcrum'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import Review from '../Components/Review/Review'
import ProductRecommendations from '../Components/ProductRecommendations/ProductRecommendations'

const Product = () => {
  const {productId} = useParams();
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [color, setColor] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    axios.get(`/api/Product/Detail/${productId}`)
    .then(res => {
      setCategory(res.data.category.categoryName)
      setProduct(res.data.product)
      setImages(res.data.images)
      setColor(res.data.color)
    })
    .catch(err => console.log(err))
    
    fetchReviews();
  },[productId])

  const fetchReviews = () => {
    axios.get(`/api/ProductReview/${productId}`)
    .then(rv => {
      if (rv.data.length > 0) { 
        const totalRating = rv.data.reduce((acc, curr) => acc + curr.rating, 0); 
        const avgRating = totalRating / rv.data.length; 
        setAverageRating(avgRating); 
        setReviews(rv.data);
      }
    })
    .catch(err => console.log(err))
  }

  const handleNewReview = (newReview) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    const totalRating = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = totalRating / updatedReviews.length;
    setAverageRating(avgRating);
  }

  return (
    <div className='mobile-product-container mt-5'>
      <Breadcrum categoryname={category} productName={product.productName}/>
      <ProductDisplay 
        images={images} 
        product={product} 
        colors={color} 
        rating={averageRating}
      />
      <Review 
        reviews={reviews} 
        productId={productId}
        onNewReview={handleNewReview}
      />
      <ProductRecommendations productId={productId} />
    </div>
  )
}

export default Product;