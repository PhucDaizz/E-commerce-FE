import React, { useEffect } from 'react';

const CreateBannerModal = ({ 
    show, 
    onHide, 
    onSubmit, 
    newBanner, 
    handleInputChange, 
    handleFileChange, 
    imagePreview, 
    isLoading 
}) => {
    if (!show) return null;
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onHide();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!newBanner.title.trim()) {
            alert('Vui lòng nhập tiêu đề banner');
            return;
        }
        
        if (!newBanner.imageFile) {
            alert('Vui lòng chọn hình ảnh banner');
            return;
        }
        
        const bannerToSubmit = {
            ...newBanner,
            description: newBanner.description.trim() || 'Banner description'
        };
        
        onSubmit(e, bannerToSubmit);
    };


    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h3>Thêm Banner Mới</h3>
                    <button type="button" onClick={onHide} aria-label="Đóng">&times;</button>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Tiêu đề *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={newBanner.title}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                        placeholder="Nhập tiêu đề banner"
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Mô tả *</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={newBanner.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        autoComplete="off"
                                        placeholder="Nhập mô tả cho banner..."
                                        required
                                    />
                                    <small className="text-muted">Trường này là bắt buộc</small>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">URL chuyển hướng</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="redirectUrl"
                                        value={newBanner.redirectUrl}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Thứ tự hiển thị</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="displayOrder"
                                            value={newBanner.displayOrder}
                                            onChange={handleInputChange}
                                            min="0"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Hình ảnh *</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    <small className="text-muted">Chỉ chấp nhận file .jpg, .jpeg, .png</small>
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="img-thumbnail" 
                                                style={{ maxHeight: '150px', width: 'auto' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Lưu trữ ảnh</label>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">Server</span>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="useCloudStorage"
                                                checked={newBanner.useCloudStorage}
                                                onChange={handleInputChange}
                                                id="storageToggle"
                                                style={{ width: '3em' }}
                                            />
                                            <label className="form-check-label" htmlFor="storageToggle">
                                                Cloud
                                            </label>
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        {newBanner.useCloudStorage 
                                            ? 'Ảnh sẽ được lưu trữ trên cloud storage' 
                                            : 'Ảnh sẽ được lưu trữ trực tiếp trên server'}
                                    </small>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="startDate"
                                        value={newBanner.startDate}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="endDate"
                                        value={newBanner.endDate}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="isActive"
                                        checked={newBanner.isActive}
                                        onChange={handleInputChange}
                                        id="isActiveCheck"
                                    />
                                    <label className="form-check-label" htmlFor="isActiveCheck">
                                        Kích hoạt
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Đang tạo...' : 'Tạo Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBannerModal;