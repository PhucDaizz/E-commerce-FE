import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCategory } from '../../Context/CategoryContext';
import { toast, ToastContainer } from 'react-toastify';
import { X, Eye } from 'lucide-react';

const EditCategory = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const { categoryID } = useParams();
    const navigate = useNavigate();
    const { getDetailCategory, editCategory } = useCategory();
    
    const [categoryName, setCategoryName] = useState('');
    const [desCategory, setDesCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [useCloudStorage, setUseCloudStorage] = useState(true);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [hasExistingImage, setHasExistingImage] = useState(false);

    useEffect(() => {
        const handleGetData = async () => {
            const response = await getDetailCategory(categoryID);
            setCategoryName(response.categoryName || '');
            setDesCategory(response.description || '');
            
            const imageUrl = resolveImageUrl(response.imageURL);
            setExistingImageUrl(imageUrl);
            setHasExistingImage(!!response.imageURL);
            
            if (response.imageURL) {
                const isCloudinary = response.imageURL.includes('cloudinary.com');
                setUseCloudStorage(isCloudinary);
            }
        };
        handleGetData();
    }, [categoryID]);

    const resolveImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        return imageUrl.startsWith('http') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
            
            if (!allowedExtensions.includes(fileExtension)) {
                toast.error(`Chỉ chấp nhận file ${allowedExtensions.join(', ')}`);
                e.target.value = '';
                return;
            }
            
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        const fileInput = document.getElementById('imageFile');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName) {
            toast.error("Vui lòng điền tên danh mục!");
            return;
        }
        
        // HasNewImage sẽ được server tính từ việc có ImageFile hay không
        await editCategory(
            categoryID, 
            categoryName, 
            desCategory, 
            imageFile, 
            useCloudStorage,
            () => {
                // Reset form sau khi thành công
                setImageFile(null);
                setImagePreview(null);
                
                // Nếu có ảnh mới, reload để hiển thị ảnh mới
                if (imageFile) {
                    navigate(0);
                }
            }
        );
    }

    return (
        <div className='add-category container mt-3'>
            <ToastContainer/>
            <div className="row">
                <div className="d-flex justify-content-between align-content-center">
                    <span className="title">Chỉnh sửa danh mục</span>
                </div>
            </div>

            <div className="row">
                <div className="col border shadow-sm bg-white ">
                    <form onSubmit={handleSubmit} className='d-flex flex-column mt-3' encType="multipart/form-data">
                        
                        <div className="form-group">
                            <label htmlFor="categoryName">Tên danh mục: *</label>
                            <input 
                                type="text" 
                                id='categoryName'
                                placeholder='Nhập tên danh mục'
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className='form-control'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="desCategory">Mô tả:</label>
                            <textarea 
                                id='desCategory'
                                placeholder='Nhập mô tả danh mục'
                                value={desCategory}
                                onChange={(e) => setDesCategory(e.target.value)}
                                className='form-control'
                                rows="3"
                            />
                        </div>

                        {/* Hiển thị ảnh hiện tại */}
                        {hasExistingImage && !imagePreview && (
                            <div className="form-group">
                                <label>Ảnh hiện tại:</label>
                                <div className="current-image-container position-relative d-inline-block">
                                    <img 
                                        src={existingImageUrl} 
                                        alt="Current category" 
                                        className="current-image img-thumbnail"
                                        style={{maxHeight: '200px'}}
                                    />
                                    <div className="position-absolute top-0 end-0 p-1">
                                        <a 
                                            href={existingImageUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-light"
                                            title="Xem ảnh gốc"
                                        >
                                            <Eye size={16} />
                                        </a>
                                    </div>
                                </div>
                                <small className="text-muted">
                                    {existingImageUrl.includes('cloudinary.com') 
                                        ? 'Ảnh đang lưu trên Cloudinary' 
                                        : 'Ảnh đang lưu trên server'
                                    }
                                </small>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="imageFile">
                                {hasExistingImage ? 'Thay đổi hình ảnh (nếu muốn):' : 'Thêm hình ảnh:'}
                            </label>
                            <input 
                                type="file" 
                                id='imageFile'
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className='form-control'
                            />
                            <small className="text-muted">
                                Chỉ chấp nhận file JPG, JPEG, PNG. Để trống nếu không muốn thay đổi ảnh.
                            </small>
                        </div>

                        {imagePreview && (
                            <div className="form-group">
                                <label>Xem trước ảnh mới:</label>
                                <div className="image-preview-container">
                                    <div className="image-preview-wrapper position-relative d-inline-block">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="image-preview img-thumbnail"
                                            style={{maxHeight: '200px'}}
                                        />
                                        <button 
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                            onClick={handleRemoveImage}
                                            title="Xóa ảnh"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chỉ hiển thị checkbox khi có ảnh mới hoặc chưa có ảnh */}
                        {(imageFile || !hasExistingImage) && (
                            <div className="form-group form-check">
                                <input 
                                    type="checkbox" 
                                    id='useCloudStorage'
                                    checked={useCloudStorage}
                                    onChange={(e) => setUseCloudStorage(e.target.checked)}
                                    className='form-check-input'
                                />
                                <label htmlFor="useCloudStorage" className="form-check-label">
                                    Lưu ảnh trên Cloud Storage
                                </label>
                                <small className="text-muted d-block">
                                    {useCloudStorage 
                                        ? 'Ảnh sẽ được lưu trữ trên Cloudinary' 
                                        : 'Ảnh sẽ được lưu trữ trên server'
                                    }
                                </small>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary mt-2 mb-3">
                            Cập nhật danh mục
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditCategory;