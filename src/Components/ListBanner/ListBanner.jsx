import React, { useState, useEffect } from 'react';
import { useBannerContext } from '../../Context/BannerContext';
import './ListBanner.css';

import CreateBannerModal from '../Modals/CreateBannerModal';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import EditBannerModal from '../Modals/EditBannerModal';

const ListBanner = () => {
    const { bannersAdmin = [], getAllBannersAdmin, deleteBanner, createBanner, changeStatusBanner, isLoading, error } = useBannerContext();
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    
    // State for delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    
    // State for create modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBanner, setNewBanner] = useState({
        title: '',
        description: '',
        redirectUrl: '',
        imageFile: null,
        isActive: true,
        displayOrder: 0,
        startDate: '',
        endDate: '',
        useCloudStorage: false
    });
    const [imagePreview, setImagePreview] = useState(null);

    // State for edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBannerId, setEditingBannerId] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                await getAllBannersAdmin();
            } catch (error) {
                console.error('Error loading banners:', error);
            }
        };
        
        fetchBanners();
    }, []);

    // Hàm xử lý URL ảnh
    const resolveImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };

    const handleEditClick = (bannerId) => {
        setEditingBannerId(bannerId);
        setShowEditModal(true);
    };

    // Hàm xử lý sau khi cập nhật thành công
    const handleUpdateSuccess = () => {
        
    };

    // Delete functions
    const handleDeleteClick = (banner) => {
        setSelectedBanner(banner);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedBanner) {
            try {
                await deleteBanner(selectedBanner.id);
                await getAllBannersAdmin();
            } catch (error) {
                console.error('Lỗi khi xóa banner:', error);
            } finally {
                setShowDeleteModal(false);
                setSelectedBanner(null);
            }
        }
    };

    // Create banner functions
    const handleCreateClick = () => {
        setShowCreateModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBanner(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewBanner(prev => ({
                ...prev,
                imageFile: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e, bannerData = newBanner) => {
        e.preventDefault();
        try {
            await createBanner(bannerData);
            await getAllBannersAdmin();
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error('Error creating banner:', error);
            alert('Lỗi: ' + error.message);
        }
    };

    const resetForm = () => {
        setNewBanner({
            title: '',
            description: '',
            redirectUrl: '',
            imageFile: null,
            isActive: true,
            displayOrder: 0,
            startDate: '',
            endDate: '',
            useCloudStorage: false
        });
        setImagePreview(null);
    };

    const handleChangeStatusBanner = async (bannerId) => {
        try {
            await changeStatusBanner(bannerId);
        } catch (error) {
            console.error('Error changing banner status:', error);
        }
    };

    return (
        <div className="banner-admin container py-4">
            <DeleteConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                bannerTitle={selectedBanner?.title || ''}
            />
            
            <CreateBannerModal
                show={showCreateModal}
                onHide={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                onSubmit={handleSubmit}
                newBanner={newBanner}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                imagePreview={imagePreview}
                isLoading={isLoading}
            />

            <EditBannerModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                bannerId={editingBannerId}
                onUpdateSuccess={handleUpdateSuccess}
            />
            
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h1 className="h4 mb-0">Danh sách Banner</h1>
                    <div className='btn-add add-product-btn'>
                        <button 
                            className="btn-primary btn-modern"
                            onClick={handleCreateClick}
                            disabled={isLoading}
                        >
                            + Thêm Banner
                        </button>
                    </div>
                </div>
                
                <div className="card-body">
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Đang tải dữ liệu...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            <strong>Lỗi:</strong> {error}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Hình ảnh</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>TT hiển thị</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bannersAdmin.length > 0 ? (
                                        bannersAdmin.map(banner => (
                                            <tr key={banner.id}>
                                                <td>{banner.title}</td>
                                                <td>
                                                    {banner.imageUrl && (
                                                        <img 
                                                            src={resolveImageUrl(banner.imageUrl)}
                                                            alt={banner.title} 
                                                            style={{ width: '100px', height: 'auto' }}
                                                            className="img-thumbnail"
                                                            onError={(e) => {
                                                                // Fallback nếu ảnh không tải được
                                                                e.target.src = 'https://via.placeholder.com/100x50?text=Image+Error';
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="form-check form-switch d-flex justify-content-center">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={banner.isActive}
                                                            onChange={() => handleChangeStatusBanner(banner.id)}
                                                            id={`toggle-${banner.id}`}
                                                            style={{ width: '2em', height: '1em' }}
                                                        />
                                                        <label 
                                                            className="form-check-label ms-2" 
                                                            htmlFor={`toggle-${banner.id}`}
                                                        >
                                                            {banner.isActive ? 'Công khai' : 'Riêng tư'}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>{new Date(banner.startDate).toLocaleDateString()}</td>
                                                <td>{banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Không giới hạn'}</td>
                                                <td>{banner.displayOrder}</td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <button style={{ width: '120px' }} className="btn btn-sm btn-outline-primary" 
                                                            onClick={() => handleEditClick(banner.id)}>
                                                            Sửa
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger w-75"
                                                            onClick={() => handleDeleteClick(banner)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading && selectedBanner?.id === banner.id ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            ) : (
                                                                'Xóa'
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                Không có banner nào được tìm thấy
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListBanner;