import React, { useState } from 'react'
import '../CSS/AddCategory.css'
import { useCategory } from '../../Context/CategoryContext';
import { toast, ToastContainer } from 'react-toastify';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState(null);
    const [desCategory, setDesCategory] = useState(null);
    const {addCategory} = useCategory()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName || !desCategory) {
            toast.error("Vui lòng điền đầy đủ tất cả các mục!");
            return;
        }
        await addCategory(categoryName,desCategory);
    }

    const handleChangeCategoryName = (e) => {
        setCategoryName(e.target.value)
    }

    const handleChangeDesCategory = (e) => {
        setDesCategory(e.target.value)
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
                    <form onSubmit={handleSubmit} className=' d-flex flex-column mt-3'>
                        
                        <div className="form-group">
                            <label htmlFor="categoryName">
                                Tên danh mục:
                            </label>
                            <input type="text" 
                                id='categoryName'
                                placeholder='Nhập tên danh mục'
                                value={categoryName}
                                onChange={handleChangeCategoryName}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="desCategory">
                                Mô tả:
                            </label>
                            <textarea type="text" 
                                id='desCategory'
                                placeholder='Nhập mô tả danh mục'
                                value={desCategory}
                                onChange={handleChangeDesCategory}
                                className='form-control'
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mt-2 mb-3">
                            Thêm sản phẩm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddCategory
