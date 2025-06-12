import React, { useEffect, useState } from 'react';
import './UploadImagesAdmin.css';
import { useProduct } from '../../Context/ProductContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Trash } from 'lucide-react';

const UploadImagesAdmin = ({productId, photos}) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [images, setImages] = useState([]);
    const [fileCount, setFileCount] = useState(0);
    const {uploadImages, deleteImage} = useProduct();

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);

        if (files.length + images.length > 5) {
            toast.warn("Bạn chỉ có thể tải lên tối đa 5 ảnh!");
            return;
        }

        const validFiles = files.filter(file => file.type.startsWith("image/"));
        if (validFiles.length !== files.length) {
            toast.warn("Chỉ được phép tải lên tệp hình ảnh!");
            return;
        }

        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prevImages => [...prevImages, ...newImages]);
        setFileCount(prevCount => prevCount + validFiles.length);
    };

    const confirmDeleteImage = (index, isUploadedImage = false) => {
        toast.warn(
            <div>
                <p>Bạn có chắc chắn muốn xóa ảnh này?</p>
                <div className="d-flex gap-2 mt-2">
                    <button 
                        className="btn btn-secondary btn-sm justify-content-center"
                        onClick={() => toast.dismiss()}
                    >
                        Hủy
                    </button>
                    <button 
                        className="btn btn-danger btn-sm justify-content-center"
                        onClick={() => {
                            if (isUploadedImage) {
                                handleDeleteUploadedImage(index);
                                handleDeleteImage(index);
                            } else {
                                handleDeleteImage(index);
                            }
                            toast.dismiss();
                        }}
                    >
                        Xóa
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeButton: false,
                draggable: false,
            }
        );
    };

    const handleDeleteImage = (index) => {
        setImages(prevImages => {
            const newImages = prevImages.filter((_, i) => i !== index);
            setFileCount(newImages.length);
            return newImages;
        });
        toast.success("Đã xóa ảnh thành công!");
    };

    const handleDeleteUploadedImage = async (imageId) => {
        try {
            // Thêm API call để xóa ảnh đã upload
            const response = await deleteImage(imageId);
            if (response.status == 200) {
                toast.success("Đã xóa ảnh thành công!");
                // Cập nhật UI sau khi xóa thành công
                // Bạn có thể thêm callback function để update parent component
            } else {
                throw new Error("Xóa ảnh thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            toast.error("Có lỗi xảy ra khi xóa ảnh!");
        }
    };

    const handleSubmitImage = async (event) => {
        event.preventDefault();

        if (images.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một ảnh để tải lên!");
            return;
        }

        const formData = new FormData();
        images.forEach(image => {
            formData.append("files", image.file);
        });

        try {
            const response = await uploadImages(productId, formData);
            if (response.status !== 200) throw new Error("Upload thất bại");

            toast.success("Tải ảnh lên thành công!");
            setImages([]);
            setFileCount(0);
        } catch (error) {
            console.error("Lỗi khi tải ảnh:", error);
            toast.error("Có lỗi xảy ra khi tải ảnh!");
        }
    };

    return (
        <div className="image-uploader shadow-sm bg-white mb-5">
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <h3>Hình ảnh sản phẩm</h3>
            <div className="image-container">
                {images.map((image, index) => (
                    <div key={index} className="image-preview">
                        <img src={image.preview} alt="preview" />
                        <button 
                            className="delete-button"
                            onClick={() => confirmDeleteImage(index)}
                        >
                            <i className="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                ))}

                {photos && photos.length > 0 ? (
                    photos.map((img) => (
                        <div key={img.imageID} className="image-preview">
                            <img src={`${apiUrl}/Resources/${img.imageURL}`} alt="preview" />
                            <button 
                                className="delete-button"
                                onClick={() => confirmDeleteImage(img.imageID, true)}
                            >
                                <i className="bi bi-trash3-fill"></i>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Không có hình ảnh nào</p>
                )}

                <label className="upload-box">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        disabled={productId === null}
                    />
                    <div className="upload-content">
                        <span>📤</span>
                        <p>Drop your images here or <span className="browse">click to browse</span></p>
                    </div>
                </label>
            </div>
            <p className="upload-info">
                You need to add at least 6 images. Pay attention to the quality of the pictures you add.
            </p>

            <button 
                className='d-flex align-content-center justify-content-center btn btn-success' 
                onClick={handleSubmitImage} 
                disabled={productId === null}
            >
                Tải ảnh lên
            </button>
        </div>
    );
};

export default UploadImagesAdmin;