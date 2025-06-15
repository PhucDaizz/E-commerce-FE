import React, { useEffect, useState } from 'react'
import './UploadImages.css'
import { useProduct } from '../../Context/ProductContext';
import { apiRequest } from '../../utils/apiHelper';
import { toast, ToastContainer } from 'react-toastify';

const UploadImages = ({productId, photos, onUploadSuccess}) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [images, setImages] = useState([]);
    const [fileCount, setFileCount] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState(photos || []);
    const {uploadImages, deleteImage} = useProduct();

    useEffect(() => {
        console.log(images)
    }, [images])

    // Cập nhật uploadedPhotos khi props photos thay đổi
    useEffect(() => {
        setUploadedPhotos(photos || []);
    }, [photos])
  
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
                setUploadedPhotos(prevPhotos => 
                    prevPhotos.filter(photo => photo.imageID !== imageId)
                );
                // Gọi callback nếu có để parent component cập nhật
                if (onUploadSuccess) {
                    onUploadSuccess(uploadedPhotos.filter(photo => photo.imageID !== imageId));
                }
            } else {
                throw new Error("Xóa ảnh thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            toast.error("Có lỗi xảy ra khi xóa ảnh!");
        }
    };
  
    const handleSubmitImage = async (event, onCloud = false) => {
        event.preventDefault();
  
        if (images.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một ảnh để tải lên!");
            return;
        }

        setIsUploading(true);
  
        const formData = new FormData();
        images.forEach(image => {
            formData.append("files", image.file);
        });
  
        try {
            const response = await uploadImages(productId, formData, onCloud);
            if (response.status !== 200) throw new Error("Upload thất bại");

            const uploadMethod = onCloud ? "Cloudinary" : "local storage";
            toast.success(`Tải ảnh lên ${uploadMethod} thành công!`);
            
            // Cập nhật danh sách ảnh đã upload
            if (response.data && Array.isArray(response.data)) {
                setUploadedPhotos(prevPhotos => [...prevPhotos, ...response.data]);
            }
            
            // Gọi callback nếu có để parent component cập nhật
            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }
            
            setFileCount(0);
            setImages([]);
        } catch (error) {
            console.error("Lỗi khi tải ảnh:", error);
            toast.error("Có lỗi xảy ra khi tải ảnh!");
        } finally {
            setIsUploading(false);
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
                        <button onClick={() => confirmDeleteImage(index)}>×</button>
                    </div>
                ))}
            
                {uploadedPhotos && uploadedPhotos.length > 0 ? (
                    uploadedPhotos.map((img) => {
                        // Kiểm tra xem ảnh có phải từ Cloudinary không
                        const isCloudinaryImage = img.imageURL && img.imageURL.includes('cloudinary.com');
                        const imageSrc = isCloudinaryImage 
                            ? img.imageURL 
                            : `${apiUrl}/Resources/${img.imageURL}`;
                        
                        return (
                            <div key={img.imageID} className="image-preview">
                                <img src={imageSrc} alt="preview" />
                                <div className="image-source-badge">
                                    {isCloudinaryImage ? (
                                        <i className="bi bi-cloud-fill text-success" title="Cloudinary"></i>
                                    ) : (
                                        <i className="bi bi-hdd-fill text-primary" title="Local Storage"></i>
                                    )}
                                </div>
                                <button onClick={() => confirmDeleteImage(img.imageID, true)}>×</button>
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}

                <label className="upload-box">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        disabled={productId === null || isUploading}
                    />
                    <div className="upload-content">
                        <span>📤</span>
                        <p>Drop your images here or <span className="browse">click to browse</span></p>
                    </div>
                </label>
            </div>
            <p className="upload-info">
                You need to add at least 5 images. Pay attention to the quality of the pictures you add.
            </p>

            <div className="upload-buttons-container">
                <button 
                    className='btn btn-primary me-2' 
                    onClick={(e) => handleSubmitImage(e, false)} 
                    disabled={productId === null || isUploading || images.length === 0}
                >
                    {isUploading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang tải lên...
                        </>
                    ) : (
                        'Tải lên Local Storage'
                    )}
                </button>
                
                <button 
                    className='btn btn-success' 
                    onClick={(e) => handleSubmitImage(e, true)} 
                    disabled={productId === null || isUploading || images.length === 0}
                >
                    {isUploading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang tải lên...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-cloud-upload me-2"></i>
                            Tải lên Cloudinary
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadImages