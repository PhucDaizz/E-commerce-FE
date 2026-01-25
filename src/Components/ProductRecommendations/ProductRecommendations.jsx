import React, { useState, useEffect, useCallback } from 'react';
import { useProduct } from '../../Context/ProductContext';
import Item from '../Item/Item';
import './ProductRecommendations.css';
import { RefreshCw, LayoutGrid, Loader2 } from 'lucide-react';

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
        if (!imageUrl) return '';
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
    }, [productId, pageIndex, hasMore, loading, products, getRecomendedProduct]);

    useEffect(() => {
        fetchProducts(true);
    }, [productId]);

    const handleLoadMore = () => {
        fetchProducts();
    };

    return (
        <div className="recommendations-premium">
            <div className="container">
                <div className="recommendations-header-center">
                    <span className="recommendations-subtitle">You might also like</span>
                    <h2 className="recommendations-title">Sản phẩm gợi ý</h2>
                </div>

                {error && (
                    <div className="recommendations-alert error">
                        <span>{error}</span>
                        <button
                            className="btn-retry"
                            onClick={() => fetchProducts(true)}
                        >
                            <RefreshCw size={16} />
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="recommendations-grid">
                    {products.map(product => {
                        const mainImage = product.images.find(img => img.isPrimary) || product.images[0];
                        const secondaryImage = product.images.find(img => !img.isPrimary) || (product.images.length > 1 ? product.images[1] : null);
                        const imageLink = mainImage ? resolveImageUrl(mainImage.imageURL) : '';
                        const hoverImageLink = secondaryImage ? resolveImageUrl(secondaryImage.imageURL) : '';

                        return (
                            <Item
                                key={product.productID}
                                id={product.productID}
                                name={product.productName}
                                price={product.price}
                                image={imageLink}
                                hoverImage={hoverImageLink}
                            />
                        );
                    })}
                </div>

                <div className="recommendations-actions">
                    {loading ? (
                        <div className="loading-indicator">
                            <Loader2 className="animate-spin" size={32} />
                            <span>Đang tải thêm...</span>
                        </div>
                    ) : hasMore ? (
                        <button
                            className="btn-load-more-premium"
                            onClick={handleLoadMore}
                        >
                            <LayoutGrid size={18} />
                            <span>Xem thêm sản phẩm</span>
                        </button>
                    ) : products.length > 0 ? (
                        <div className="all-loaded-message">
                            Đã hiển thị tất cả sản phẩm phù hợp.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ProductRecommendations;