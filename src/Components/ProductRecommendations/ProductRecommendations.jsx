import React, { useState, useEffect, useCallback } from 'react';
import { useProduct } from '../../Context/ProductContext';
import Item from '../Item/Item';

const ProductRecommendations = ({ productId }) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const { getRecomendedProduct } = useProduct();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 4;

        const resolveImageUrl = (imageUrl) => {
            return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
        };

    const fetchProducts = useCallback(async (reset = false) => {
        if ((!hasMore && !reset) || loading) return;

        setLoading(true);
        setError(null);
        
        try {
        const currentPage = reset ? 1 : pageIndex;
        const response = await getRecomendedProduct(productId, currentPage, pageSize);

        setProducts(prev => reset ? response.items : [...prev, ...response.items]);
        setHasMore((reset ? response.items : products.concat(response.items)).length < response.totalCount);
        setPageIndex(reset ? 2 : prev => prev + 1);
        } catch (err) {
        setError('Không thể tải sản phẩm gợi ý');
        console.error(err);
        } finally {
        setLoading(false);
        }
    }, [productId, pageIndex, hasMore, loading]);

    useEffect(() => {
        fetchProducts(true);
    }, [productId]);

    const handleLoadMore = () => {
        fetchProducts();
    };

    return (
        <div className="container mt-5">
        <h4 className="mb-4">Sản phẩm gợi ý</h4>

        {error && (
            <div className="alert alert-danger alert-dismissible fade show">
            {error}
            <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
            ></button>
            <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => fetchProducts(true)}
            >
                Thử lại
            </button>
            </div>
        )}

        <div className="shop-product">
            {products.map(product => {
                const mainImage = product.images.find(img => img.isPrimary) || product.images[0];
                const imageLink = mainImage ? resolveImageUrl(mainImage.imageURL) : '';
                return (
                    <Item key={product.productID} id={product.productID} name={product.productName} price={product.price} image={imageLink} />
                    // <div key={product.productID} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    //   <div className="card h-100">
                    //     <img 
                    //       src={mainImage?.imageURL || 'https://via.placeholder.com/300'} 
                    //       className="card-img-top" 
                    //       alt={product.productName}
                    //       style={{ height: '200px', objectFit: 'cover' }}
                    //     />
                    //     <div className="card-body">
                    //       <h5 className="card-title text-truncate">{product.productName}</h5>
                    //       <p className="card-text text-danger fw-bold">
                    //         {new Intl.NumberFormat('vi-VN', { 
                    //           style: 'currency', 
                    //           currency: 'VND' 
                    //         }).format(product.price)}
                    //       </p>
                    //     </div>
                    //     <div className="card-footer bg-white">
                    //       <a 
                    //         href={`/products/${product.productID}`} 
                    //         className="btn btn-primary w-100"
                    //       >
                    //         Xem chi tiết
                    //       </a>
                    //     </div>
                    //   </div>
                    // </div>
                );
            })}
        </div>

        {loading && (
            <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Đang tải sản phẩm...</p>
            </div>
        )}

        {hasMore && !loading && products.length > 0 && (
            <div className="text-center mt-3">
            <button 
                className="btn btn-outline-primary"
                onClick={handleLoadMore}
            >
                Xem thêm sản phẩm
            </button>
            </div>
        )}

        {!hasMore && products.length > 0 && (
            <div className="alert alert-info text-center mt-3">
            Đã hiển thị tất cả sản phẩm gợi ý
            </div>
        )}
        </div>
    );
};

export default ProductRecommendations;