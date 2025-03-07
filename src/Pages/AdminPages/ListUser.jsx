import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import Pagination from '../../Components/Pagination/Pagination';

const ListUser = () => {
    const { getAllUser } = useAuth();
    const [dataAllUser, setDataAllUser] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [fieldSearch, setFieldSearch] = useState("Email");
    const [totalPages, setTotalPages] = useState(1);
    const [querySearch, setQuerySearch] = useState("");
    const [clickSearch, setClickSearch]  = useState(false);

    const handleGetAllUser = async () => {
        const response = await getAllUser(querySearch, fieldSearch, currentPage, itemsPerPage);
        if (response.status === 200) {
            setDataAllUser(response.data);
            setTotalPages(Math.ceil(response.data.totalItem / itemsPerPage));
        }
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = Number(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        handleGetAllUser();
    };

    const handleFieldSearchChange = (event) => {
        setFieldSearch(event.target.value);
        setCurrentPage(1);
        handleGetAllUser();
    };

    const handleQuerySearchChange = (event) => {
        setQuerySearch(event.target.value);
        setCurrentPage(1);
    };

    const handleClickSearch = () => {
        setClickSearch(!clickSearch);
    }

    useEffect(() => {
        handleGetAllUser();
    }, [currentPage, itemsPerPage, fieldSearch, clickSearch]);

    useEffect(() => {
        console.log(dataAllUser);
    }, [dataAllUser]);

    return (
        <div className='list-user container'>
            <div className='d-flex mt-3'>
                <h4>Tất cả người dùng</h4>
            </div>
            <div className='border p-3 bg-white mb-2'>
                <div className='d-flex align-items-center mb-3'>
                    <div>
                        <label className='me-2 mb-0'>Hiển thị</label>
                        <select 
                            className='form-select d-inline-block w-auto me-2'
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>

                    <div>
                        <label className='me-2 mb-0'>Tìm kiếm theo</label>
                        <select 
                            className='form-select d-inline-block w-auto me-2'
                            value={fieldSearch}
                            onChange={handleFieldSearchChange}
                        >
                            <option value="">---</option>
                            <option value="Email">Email</option>
                            <option value="PhoneNumber">SĐT</option>
                            <option value="FullName">Người dùng</option>
                        </select>
                    </div>

                    <div className='d-flex position-relative w-25'>
                        <input
                            type="text"
                            className='form-control'
                            placeholder='Tìm kiếm'
                            value={querySearch}
                            onChange={handleQuerySearchChange}
                            style={{ paddingRight: '30px' }}
                        />
                        <i className="bi bi-search position-absolute" 
                            style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                            onClick={() => handleClickSearch()}
                        ></i>
                    </div>
                </div>

                <div className="row fw-bold border bg-light border-0 p-3">
                    <div className="col">Người dùng</div>
                    <div className="col">SĐT</div>
                    <div className="col">Email</div>
                    <div className="col">Địa chỉ</div>
                    <div className="col">Giới tính</div>
                </div>
                {/* List user */}
                {
                    (dataAllUser.inforDTOs !== null && dataAllUser.totalItem > 0) ? (
                        <div className='mt-4' style={{fontSize: '14px'}}>
                            {
                                dataAllUser.inforDTOs.map((user, index) => (
                                    <div className={`row p-3 ${index % 2 === 0 ? 'bg-light' : ''}`} key={user.userID} >
                                        <div className="col">{user.userName}</div>
                                        <div className="col">{user.phoneNumber}</div>
                                        <div className="col">{user.email}</div>
                                        <div className="col">{user.address}</div>
                                        <div className="col">{user.gender !== null && user.gender !== undefined ? (user.gender ? 'Nam' : 'Nữ') : ''}</div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className='p-5 d-flex justify-content-center m-auto'>
                            <h4>Danh sách người dùng rỗng</h4>
                        </div>
                    )
                }
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ListUser;