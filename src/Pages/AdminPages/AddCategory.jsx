import React, { useState } from 'react'
import '../CSS/AddCategory.css'
import { useCategory } from '../../Context/CategoryContext';
import { toast, ToastContainer } from 'react-toastify';
import { X } from 'lucide-react';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [desCategory, setDesCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [useCloudStorage, setUseCloudStorage] = useState(true);
    const { addCategory } = useCategory();

    // Hàm reset form
    const resetForm = () => {
        setCategoryName('');
        setDesCategory('');
        setImageFile(null);
        setImagePreview(null);
        setUseCloudStorage(true);
        
        // Reset input file
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

        // Thêm callback reset form sau khi add thành công
        await addCategory(categoryName, desCategory, imageFile, useCloudStorage, resetForm);
    }

    // ... các hàm xử lý khác giữ nguyên
    const handleChangeCategoryName = (e) => {
        setCategoryName(e.target.value);
    }

    const handleChangeDesCategory = (e) => {
        setDesCategory(e.target.value);
    }

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

    const handleCloudStorageChange = (e) => {
        setUseCloudStorage(e.target.checked);
    }

    return (
        <div className='add-category container mt-3'>
            <ToastContainer/>
            <div className="row">
                <div className="d-flex justify-content-between align-content-center">
                    <span className="title">Thêm mục sản phẩm</span>
                </div>
            </div>

            <div className="row">
                <div className="col border shadow-sm bg-white ">
                    <form onSubmit={handleSubmit} className='d-flex flex-column mt-3' encType="multipart/form-data">
                        
                        <div className="form-group">
                            <label htmlFor="categoryName">
                                Tên danh mục: *
                            </label>
                            <input 
                                type="text" 
                                id='categoryName'
                                placeholder='Nhập tên danh mục'
                                value={categoryName}
                                onChange={handleChangeCategoryName}
                                className='form-control'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="desCategory">
                                Mô tả:
                            </label>
                            <textarea 
                                type="text" 
                                id='desCategory'
                                placeholder='Nhập mô tả danh mục'
                                value={desCategory}
                                onChange={handleChangeDesCategory}
                                className='form-control'
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageFile">
                                Hình ảnh danh mục:
                            </label>
                            <input 
                                type="file" 
                                id='imageFile'
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className='form-control'
                            />
                            <small className="text-muted">
                                Chỉ chấp nhận file JPG, JPEG, PNG
                            </small>
                        </div>

                        {imagePreview && (
                            <div className="form-group">
                                <label>Xem trước ảnh:</label>
                                <div className="image-preview-container">
                                    <div className="image-preview-wrapper">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="image-preview"
                                        />
                                        <button 
                                            type="button"
                                            className="btn-remove-image"
                                            onClick={handleRemoveImage}
                                            title="Xóa ảnh"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <small className="text-muted">
                                        Nhấn vào icon X để chọn ảnh khác
                                    </small>
                                </div>
                            </div>
                        )}

                        <div className="form-group form-check">
                            <input 
                                type="checkbox" 
                                id='useCloudStorage'
                                checked={useCloudStorage}
                                onChange={handleCloudStorageChange}
                                className='form-check-input'
                            />
                            <label htmlFor="useCloudStorage" className="form-check-label">
                                Sử dụng Cloud Storage
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary mt-2 mb-3">
                            Thêm danh mục
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddCategory;