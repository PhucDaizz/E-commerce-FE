import React, { useEffect, useState } from 'react';
import './UpdateInfor.css';
import { useAuth } from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../api/axios';

const UpdateInfor = () => {
    const { getInforUser, updateUserInfor, confirmEmail } = useAuth(); 

    const [listProvince,setListProvince] = useState([]);
    const [listDistrict,setListDistrict] = useState([]);
    const [listWard,setListWard] = useState([]);
    
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    const [fullLocation, setFullLocation] = useState('');
    const [detailLocaton, setDetailLocaton] = useState('');
    const [isFillFull, setIsFillFull] = useState(false);

    useEffect(() => {
        getProvince();
    }, [])

    useEffect(() => {
        if (province) {
            getDistrict(province);
        }
    }, [province]);
    
    useEffect(() => {
        if (district) {
            getWard(district);
        }
    }, [district]);
    
    useEffect(() => {
        if (ward) {
            getFullLocation(ward);
        }
    }, [ward]);

    useEffect(() => {
        const newDetailLocation = `${specificAddress ? specificAddress + ', ' : ''}${fullLocation || ''}`;
        setDetailLocaton(newDetailLocation);
    
        setDataUser(prev => ({
            ...prev,
            address: newDetailLocation
        }));
    }, [specificAddress, fullLocation]);    


    const getProvince = async() => {
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
        setListProvince(response.data.data)
    }
    
    const getDistrict = async(province) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${province}.htm`);
        setListDistrict(response.data.data)
    }

    const getWard = async(district) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${district}.htm`);
        setListWard(response.data.data)
    }

    const getFullLocation = async(ward) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/5/${ward}.htm`);
        setFullLocation(response.data.data.full_name);
    }


    const handleProvinceChange = (e) => {
        setProvince(e.target.value);
        setDistrict('');
        setWard('');
    };
    
    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
    };
    const handleWardChange = (e) => {
        setWard(e.target.value);
        checkFillFullLocaton()
    };

    const handleSpecificAddressChange = (e) => {
        setSpecificAddress(e.target.value);
    };
    
    const checkFillFullLocaton = () => {
        if(province != null &&district != null && ward != null) {
            setIsFillFull(true);
        }
        else {
            setIsFillFull(false);
        }
    }


    const [dataUser, setDataUser] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        address: '',
        gender: '',
        emailConfirmed: false
    });

    useEffect(() => {
        handleGetDataUser();
    }, []);

    const handleGetDataUser = async () => {
        const response = await getInforUser();
        setDataUser(response);
        setDetailLocaton(response.address)
        console.log(response)
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        let convertedValue = value;

        if (id === 'gender') {
            convertedValue = value === 'true' ? true : value === 'false' ? false : value;
        }
        setDataUser((prevState) => ({
            ...prevState,
            [id]: convertedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!dataUser.phoneNumber || !dataUser.address) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }
    
            setDataUser(prev => ({
                ...prev,
                address: detailLocaton
            }))
    
            const response = await updateUserInfor(dataUser);
            
            if (response?.status === 200) {
                toast.success('Cập nhật thông tin thành công');
                handleGetDataUser(); // Refresh user data
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        }
    };

    const handleConfirmEmail = async () => {
        const response = await confirmEmail();
        if (response.status === 200) {
            toast.success('Vui lòng kiểm tra email của bạn để xác nhận');
            
        } else {
            toast.error('Có lỗi xảy ra khi xác nhận email, vui lòng thử lại');
        }
    };  

    return (
        <div className='updateinfor container mt-5 mb-2' style={{minHeight: '75vh'}}>
            <ToastContainer />
            <h2 className='mb-4'>Thông tin người dùng</h2>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className='form-group mb-3'>
                            <label htmlFor='userName'>Tên người dùng</label>
                            <input
                                type='text'
                                id='userName'
                                className='form-control'
                                value={dataUser.userName}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className='form-group mb-3 row'>
                            <label htmlFor='email'>Email</label>
                            <div className='d-flex'>
                                <input
                                    type='email'
                                    id='email'
                                    className='form-control w-75'
                                    value={dataUser.email}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                />
                                <button type='button' className='btn btn-outline-dark col ms-2'
                                    onClick={handleConfirmEmail}
                                    disabled={dataUser.emailConfirmed}
                                >
                                    {dataUser.emailConfirmed ? 'Đã xác nhận' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor='phoneNumber'>Số điện thoại</label>
                            <input
                                type='tel'
                                id='phoneNumber'
                                className='form-control'
                                value={dataUser.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className='form-group mb-3'>
                            <label htmlFor='gender'>Giới tính</label>
                            <select
                                id='gender'
                                className='form-control'
                                value={dataUser.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Chọn giới tính</option>
                                <option value='true'>Nam</option>
                                <option value='false'>Nữ</option>
                                <option value=''>Khác</option>
                            </select>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="mb-3">
                            <label className="form-label">Tỉnh thành</label>
                            <select className="form-select" onChange={handleProvinceChange}>
                                <option value=''>---</option>
                                {
                                    listProvince.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                                
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quận huyện</label>
                            <select className="form-select" disabled={!province} onChange={handleDistrictChange}>
                                <option value=''>---</option>
                                {
                                    listDistrict.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phường xã</label>
                            <select className="form-select" disabled={!district} onChange={handleWardChange}>
                                <option value=''>---</option>
                                {
                                    listWard.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ</label>
                            <input type="text" className="form-control"  
                                onChange={handleSpecificAddressChange}
                                placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường,..)" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ của bạn là:</label>
                            <textarea id='address' type="text" className="form-control" value={detailLocaton} onChange={handleChange} placeholder="Địa chỉ chi tiết" disabled/>
                        </div>
                    

                
                        <button type='submit' className='btn btn-outline-dark'>Lưu thông tin</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateInfor;
