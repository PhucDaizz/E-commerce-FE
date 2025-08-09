import React, { useState, useEffect } from 'react';
import { useBannerContext } from '../../Context/BannerContext';
import { toast } from 'react-toastify';

const EditBannerModal = ({ 
  show, 
  onHide, 
  bannerId, 
  onUpdateSuccess 
}) => {
  const { getBannerById, updateBanner } = useBannerContext();
  const [bannerData, setBannerData] = useState({
    title: '',
    description: '',
    redirectUrl: '',
    isActive: true,
    displayOrder: 0,
    startDate: '',
    endDate: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && bannerId) {
      loadBannerData();
    }
  }, [show, bannerId]);

  const loadBannerData = async () => {
    try {
      setIsLoading(true);
      const data = await getBannerById(bannerId);
      setBannerData({
        title: data.title,
        description: data.description,
        redirectUrl: data.redirectUrl,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        startDate: data.startDate?.split('T')[0] || '',
        endDate: data.endDate?.split('T')[0] || ''
      });
      if (data.imageUrl) {
        setImagePreview(`${import.meta.env.VITE_BASE_API_URL}${data.imageUrl}`);
      }
    } catch (error) {
      console.error('Error loading banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const updatedBanner = await updateBanner(bannerId, bannerData);
        
        onHide();
        
        onUpdateSuccess(updatedBanner); 
        toast.success('Cập nhật banner thành công!');
        } catch (error) {
            toast.error(error.message);
        }
    };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onHide()}>
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3>Chỉnh sửa Banner</h3>
          <button type="button" onClick={onHide} aria-label="Đóng">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={bannerData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={bannerData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">URL chuyển hướng</label>
                    <input
                      type="url"
                      className="form-control"
                      name="redirectUrl"
                      value={bannerData.redirectUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Thứ tự hiển thị</label>
                      <input
                        type="number"
                        className="form-control"
                        name="displayOrder"
                        value={bannerData.displayOrder}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Hình ảnh</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="img-thumbnail" 
                          style={{ maxHeight: '150px' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={bannerData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Ngày kết thúc</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={bannerData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isActive"
                      checked={bannerData.isActive}
                      onChange={handleInputChange}
                      id="editIsActive"
                      style={{ width: '3em', height: '1.5em' }}
                    />
                    <label className="form-check-label" htmlFor="editIsActive">
                      Kích hoạt
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBannerModal;