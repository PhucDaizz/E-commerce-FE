// Product.js
import React, { useEffect, useState } from 'react'
import Breadcrum from '../Components/Breadcrum/Breadcrum'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import Review from '../Components/Review/Review'
import ProductRecommendations from '../Components/ProductRecommendations/ProductRecommendations'

const Product = () => {
  const { productId } = useParams();
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [color, setColor] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    axios.get(`/api/Product/Detail/${productId}`)
      .then(res => {
        setCategory(res.data.category.categoryName)
        setProduct(res.data.product)
        setImages(res.data.images)
        setColor(res.data.color)
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })

    fetchReviews();
  }, [productId])

  const fetchReviews = () => {
    axios.get(`/api/ProductReview/${productId}`)
      .then(rv => {
        if (rv.data.length > 0) {
          const totalRating = rv.data.reduce((acc, curr) => acc + curr.rating, 0);
          const avgRating = totalRating / rv.data.length;
          setAverageRating(avgRating);
          setReviews(rv.data);
        } else {
          setAverageRating(0);
          setReviews([]);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <main className='product-page-wrapper'>
      <div className="container mx-auto px-4 py-6">
        <Breadcrum categoryname={category} productName={product.productName} />
      </div>

      <ProductDisplay
        images={images}
        product={product}
        colors={color}
        averageRating={averageRating}
        reviewsCount={reviews.length}
      />

      <div className="container mx-auto px-4">
        <Review
          reviews={reviews}
          productId={productId}
          onNewReview={handleNewReview}
        />

        <div className="my-16">
          <ProductRecommendations productId={productId} />
        </div>
      </div>
    </main>
  )
}

export default Product;
