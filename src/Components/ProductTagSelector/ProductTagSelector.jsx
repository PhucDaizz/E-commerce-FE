import React, { useState, useEffect } from 'react';
import { useTagContext } from '../../Context/TagContext';
import './ProductTagSelector.css'

const ProductTagSelector = ({ productId, isEditMode = false }) => {
  const { getTags, getTagsByProduct, syncTagsToProduct } = useTagContext();
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState({
    tags: false,
    productTags: false,
    submit: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load danh sách tag và tag của sản phẩm (nếu ở chế độ chỉnh sửa)
  useEffect(() => {
    const loadData = async () => {
      if (!productId) return;
      
      try {
        setLoading(prev => ({ ...prev, tags: true, productTags: isEditMode }));
        setError(null);
        
        // Load tất cả tags
        const tagsResponse = await getTags();
        setAllTags(tagsResponse.data || []);
        
        // Nếu ở chế độ chỉnh sửa, load tags của sản phẩm
        if (isEditMode) {
          const productTagsResponse = await getTagsByProduct(productId);
          const productTagIds = productTagsResponse.data?.map(tag => tag.tagID) || [];
          setSelectedTags(productTagIds);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, tags: false, productTags: false }));
      }
    };

    loadData();
  }, [productId, isEditMode]);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!productId) return;
    
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      setError(null);
      setSuccess(null);
      
      const response = await syncTagsToProduct(productId, selectedTags);
      if (response.data === "Product tags synchronized successfully") {
        setSuccess('Cập nhật thẻ thành công');
      } else {
        throw new Error(response.message || 'Failed to sync tags');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDeselectAll = () => {
    setSelectedTags([]);
  };

  // Kiểm tra loading state tổng hợp
  const isLoading = loading.tags || loading.productTags || loading.submit;

  return (
    <div className="product-tag-selector">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-gradient-primary text-white border-0">
          <div className="d-flex align-items-center">
            <div className="tag-icon me-2">
              <i className="bi bi-tags"></i>
            </div>
            <h5 className="mb-0 fw-semibold">Quản lý Tags sản phẩm</h5>
            {selectedTags.length > 0 && (
              <span className="badge bg-light text-primary ms-auto px-3 py-2">
                {selectedTags.length} đã chọn
              </span>
            )}
          </div>
        </div>

        {productId ? (
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-center">
                  <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                  <div className="flex-grow-1">
                    <strong>Lỗi!</strong> {error}
                  </div>
                  <button 
                    className="btn btn-outline-danger btn-sm ms-3"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-redo me-1"></i>
                    Tải lại
                  </button>
                </div>
              </div>
            )}
            
            {success && (
              <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  <strong>Thành công!</strong> {success}
                </div>
              </div>
            )}
            
            {(loading.tags || (isEditMode && loading.productTags)) ? (
              <div className="loading-container text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="text-muted">
                  {isEditMode ? 'Đang tải tags của sản phẩm...' : 'Đang tải danh sách tags...'}
                </h6>
              </div>
            ) : (
              <>
                <div className="tags-section">
                  <div className="section-header mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-primary fw-semibold mb-1">
                          <i className="fas fa-list me-2"></i>
                          {isEditMode ? 'Tags hiện tại của sản phẩm:' : 'Chọn tags cho sản phẩm:'}
                        </h6>
                        <small className="text-muted">
                          Click vào các tags để chọn/bỏ chọn
                        </small>
                      </div>
                      {selectedTags.length > 0 && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleDeselectAll}
                          disabled={loading.submit}
                          title="Bỏ chọn tất cả"
                        >
                          <i className="fas fa-times me-1"></i>
                          Bỏ chọn tất cả
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {allTags.length === 0 ? (
                    <div className="empty-state text-center py-4">
                      <div className="empty-icon mb-3">
                        <i className="fas fa-tag text-muted" style={{fontSize: '3rem', opacity: '0.3'}}></i>
                      </div>
                      <h6 className="text-muted">Chưa có tags nào</h6>
                      <small className="text-muted">Vui lòng tạo tags trước khi gắn cho sản phẩm</small>
                    </div>
                  ) : (
                    <div className="tags-grid">
                      {allTags.map(tag => (
                        <button
                          key={tag.tagID}
                          type="button"
                          className={`tag-item ${selectedTags.includes(tag.tagID) ? 'selected' : ''}`}
                          onClick={() => handleTagToggle(tag.tagID)}
                          disabled={loading.submit}
                        >
                          <span className="tag-name">{tag.tagName}</span>
                          {selectedTags.includes(tag.tagID) && (
                            <i className="fas fa-check tag-check"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {allTags.length > 0 && (
                  <div className="actions-section mt-4 pt-4 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="selected-info">
                        <span className="badge bg-light text-dark px-3 py-2">
                          <i className="fas fa-check-double me-2"></i>
                          {selectedTags.length} / {allTags.length} tags
                        </span>
                      </div>
                      
                      <button
                        className="btn btn-primary px-4 py-2 fw-semibold"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {loading.submit ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Lưu tags
                          </>
                        )}
                      </button>
                    </div>
                    
                    {selectedTags.length === 0 && (
                      <div className="mt-2">
                        <small className="text-warning">
                          <i className="fas fa-info-circle me-1"></i>
                          Vui lòng chọn ít nhất một tag để lưu
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="card-body text-center py-5">
            <div className="empty-state">
              <div className="empty-icon mb-3">
                <i className="fas fa-box-open text-muted" style={{fontSize: '4rem', opacity: '0.3'}}></i>
              </div>
              <h5 className="text-muted mb-2">Chưa có sản phẩm</h5>
              <p className="text-muted mb-4">
                Vui lòng tạo sản phẩm trước khi gắn tags
              </p>
              <button className="btn btn-outline-primary">
                <i className="fas fa-plus me-2"></i>
                Tạo sản phẩm mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTagSelector;