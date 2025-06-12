import React, { useEffect, useState } from 'react'
import './UploadImages.css'
import { useProduct } from '../../Context/ProductContext';
import { apiRequest } from '../../utils/apiHelper';
import { toast, ToastContainer } from 'react-toastify';


const UploadImages = ({productId, photos}) => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const [images, setImages] = useState([]);
    const [fileCount, setFileCount] = useState(0);
    const {uploadImages} = useProduct();

    useEffect(() => {
      console.log(images)
    },[])
  
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
  
    const handleDeleteImage = (index) => {
      setImages(prevImages => {
        const newImages = prevImages.filter((_, i) => i !== index);
        setFileCount(newImages.length);
        return newImages;
      });
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
        setFileCount(0);
        setImages(response.data)
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        toast.error("Có lỗi xảy ra khi tải ảnh!");
      }
    };
  
    return (
        <div className="image-uploader shadow-sm bg-white mb-5 ">
            <ToastContainer/>
            <h3>Hình ảnh sản phẩm</h3>
            <div className="image-container">
            {images.map((image, index) => (
                <div key={index} className="image-preview">
                <img src={image.preview} alt="preview" />
                <button onClick={() => handleDeleteImage(index)}>×</button>
                </div>
            ))}
            
            {
              photos && photos.length > 0 ? (
                photos.map((img) => (
                  <div key={img.imageID} className="image-preview">
                    <img src={`${apiUrl}/Resources/${img.imageURL}`} alt="preview" />
                    <button onClick={() => handleDeleteImage(img.imageID)}>×</button>
                  </div>
                ))
              ) : (
                <></>
                // <p>Không có hình ảnh nào</p>
              )
            }

            <label className="upload-box">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={productId === null}/>
                <div className="upload-content">
                <span>📤</span>
                <p>Drop your images here or <span className="browse">click to browse</span></p>
                </div>
            </label>
            </div>
            <p className="upload-info">
            You need to add at least 5 images. Pay attention to the quality of the pictures you add.
            </p>

            <button className='d-flex align-content-center justify-content-center btn btn-success' onClick={handleSubmitImage} disabled={productId === null}>Tải ảnh lên</button>
        </div>
    );
  };
  

export default UploadImages
