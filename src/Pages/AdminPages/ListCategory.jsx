import React, { useEffect, useState } from 'react';
import { useCategory } from '../../Context/CategoryContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ListCategory = () => {
    const { getCategory, categories, deleteCategory, setCategories } = useCategory();
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {
        getCategory();
    }, []);

    const handleDeleteCategory = async (categoryID) => {
        const warningToast = toast.warn(
            <div className="p-3">
                <h5 className="text-warning">Xác nhận xoá mục</h5>
                <p>Bạn có chắc muốn xoá mục này?</p>
                <p className="text-danger">
                    Lưu ý: Nếu bạn xoá, dữ liệu của sản phẩm cũng sẽ bị xoá, và nếu khách hàng đã mua sản phẩm này trước đó, dữ liệu của họ cũng sẽ mất đi.
                </p>
                <p className="text-danger">Nếu bạn chưa thêm SP nào vào mục này thì có thể xoá bình thường</p>
                <div className="d-flex justify-content-center mt-3">
                    <button onClick={() => toast.dismiss(warningToast)} className="btn btn-secondary me-2">Huỷ</button>
                    <button onClick={async () => {
                        toast.dismiss(warningToast);
                        var response = await deleteCategory(categoryID);
                        if (response.status === 200) {
                            toast.success('Xoá mục sp thành công');
                            setCategories(prevCategories => prevCategories.filter(cat => cat.categoryID !== categoryID));
                        }
                    }} className="btn btn-danger">Xoá</button>
                </div>
            </div>
        );
    };

    // 🔍 Lọc danh mục theo từ khóa tìm kiếm
    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchCategory.toLowerCase())
    );

    return (
        <div className="list-category container">
            <ToastContainer />
            <h4 className="mt-3">Danh sách mục sản phẩm</h4>
            <div className="border shadow-sm mt-3 p-3 bg-white">
                <div className="row container mt-2 align-items-center">
                    <div className="col-7 d-flex align-items-center">
                        <label htmlFor="find" className="ms-4 me-2 mb-0">Mục</label>
                        <input
                            id="find"
                            name="find"
                            type="text"
                            className="form-control d-inline-block w-50"
                            placeholder="Tìm kiếm..."
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        />
                    </div>
                    <div className="col text-end btn-add">
                        <Link to={'/admin/categories/add'} className="btn-link">
                            <button className="btn btn-outline-primary">
                                <i className="bi bi-plus"></i> Thêm mới
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="product-list mt-3 bg-light">
                    <div className="row d-flex align-content-center">
                        <div className="col-5">Danh mục</div>
                        <div className="col">Mã danh mục</div>
                        <div className="col">Mô tả</div>
                        <div className="col d-flex justify-content-center">Thao tác</div>
                    </div>
                </div>

                <table className="mt-2 table table-hover">
                    <tbody>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <tr key={category.categoryID} className="row mb-2 p-2">
                                    <div className="col-5 d-flex align-items-center">{category.categoryName}</div>
                                    <div className="col d-flex align-items-center">{category.categoryID}</div>
                                    <div className="col d-flex align-items-center">{category.description}</div>
                                    <div className="col d-flex align-items-center justify-content-center">
                                        <Link to={`/admin/categories/edit/${category.categoryID}`}>
                                            <i className="bi bi-pencil-fill text-success fs-6 me-1 p-1"></i>
                                        </Link>
                                        <i className="bi bi-trash3 text-danger fs-6 p-1"
                                           onClick={() => handleDeleteCategory(category.categoryID)}></i>
                                    </div>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Không có danh mục phù hợp</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListCategory;
