import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../api/axios';
import './UpdateInfor.css'; // Import the CSS file

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
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [emailLoading, setEmailLoading] = useState(false);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

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

    const handleSubmit = async () => {
        setLoading(true);
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
                handleGetDataUser();
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmEmail = async () => {
        if (cooldown > 0 || emailLoading) return;
        try {
            setEmailLoading(true);
            const response = await confirmEmail();
            if (response.status === 200) {
            toast.success('Vui lòng kiểm tra email của bạn để xác nhận');
            setCooldown(60); // bắt đầu đếm ngược 60 giây
            } else {
            toast.error('Có lỗi xảy ra khi xác nhận email, vui lòng thử lại');
            }
        } catch (error) {
            toast.error('Lỗi kết nối, vui lòng thử lại sau');
            console.error(error);
        } finally {
            setEmailLoading(false);
        }
    }; 

    return (
        <div className="update-infor-container">
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
                theme="light"
            />
            
            <div className="container py-5">
                <div className="card">
                    {/* Header */}
                    <div className="card-header">
                        <h1 className="header-title">THÔNG TIN CÁ NHÂN</h1>
                        <p className="header-subtitle">Cập nhật thông tin tài khoản của bạn</p>
                        <div className="header-text-overlay">
                            USER PROFILE
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="form-content">
                        <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                            <div className="row">
                                {/* Personal Information Column */}
                                <div className="col-lg-6">
                                    <h3 className="section-title">Thông tin cơ bản</h3>
                                    
                                    <div className="input-group">
                                        <label className="label">Tên người dùng</label>
                                        <input
                                            type="text"
                                            id="userName"
                                            className="input input-readonly"
                                            value={dataUser.userName}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Email</label>
                                        <div className="email-container">
                                            <div className="email-input-wrapper">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="input input-readonly"
                                                    value={dataUser.email}
                                                    onChange={handleChange}
                                                    required
                                                    readOnly
                                                />
                                                <div className="status-badge-wrapper">
                                                    <span className={`status-badge ${dataUser.emailConfirmed ? 'status-confirmed' : 'status-pending'}`}>
                                                        {dataUser.emailConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                                                    </span>
                                                </div>
                                            </div>
                                           <button 
                                                type="button" 
                                                onClick={handleConfirmEmail}
                                                disabled={dataUser.emailConfirmed || cooldown > 0 || emailLoading}
                                                className={`button-secondary ${
                                                dataUser.emailConfirmed || cooldown > 0 || emailLoading ? 'button-disabled' : ''
                                            }`}
                                            >
                                                {dataUser.emailConfirmed 
                                                    ? 'Đã xác nhận' 
                                                    : emailLoading 
                                                    ? 'Đang gửi...' 
                                                    : cooldown > 0 
                                                        ? `Gửi lại sau ${cooldown}s` 
                                                        : 'Xác nhận'}
                                            </button>

                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            className="input"
                                            value={dataUser.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Giới tính</label>
                                        <select
                                            id="gender"
                                            className="select"
                                            value={dataUser.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="true">Nam</option>
                                            <option value="false">Nữ</option>
                                            <option value="">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Address Information Column */}
                                <div className="col-lg-6">
                                    <h3 className="section-title">Thông tin địa chỉ</h3>
                                    
                                    <div className="input-group">
                                        <label className="label">Tỉnh thành</label>
                                        <select 
                                            className="select"
                                            onChange={handleProvinceChange}
                                            value={province}
                                        >
                                            <option value="">Chọn tỉnh thành</option>
                                            {listProvince.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Quận huyện</label>
                                        <select 
                                            className="select"
                                            disabled={!province} 
                                            onChange={handleDistrictChange}
                                            value={district}
                                        >
                                            <option value="">Chọn quận huyện</option>
                                            {listDistrict.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Phường xã</label>
                                        <select 
                                            className="select"
                                            disabled={!district} 
                                            onChange={handleWardChange}
                                            value={ward}
                                        >
                                            <option value="">Chọn phường xã</option>
                                            {listWard.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Địa chỉ cụ thể</label>
                                        <input 
                                            type="text" 
                                            className="input"
                                            onChange={handleSpecificAddressChange}
                                            value={specificAddress}
                                            placeholder="Số nhà, tên đường..."
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Địa chỉ đầy đủ</label>
                                        <textarea 
                                            id="address"
                                            className="textarea"
                                            value={detailLocaton} 
                                            onChange={handleChange}
                                            placeholder="Địa chỉ chi tiết sẽ hiển thị tại đây"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            {/* Submit Button */}
                            <div className="text-center">
                                <button 
                                    type="button"
                                    onClick={handleSubmit} 
                                    className={`button-primary ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading && <span className="loading-spinner"></span>}
                                    {loading ? 'ĐANG LÀM...' : 'CẬP NHẬT THÔNG TIN'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateInfor;