import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../api/axios';
import { User, MapPin, Mail, Phone, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import './UpdateInfor.css';

const UpdateInfor = () => {
    const { getInforUser, updateUserInfor, confirmEmail } = useAuth();

    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    const [fullLocation, setFullLocation] = useState('');
    const [detailLocaton, setDetailLocaton] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [emailLoading, setEmailLoading] = useState(false);

    const [dataUser, setDataUser] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        address: '',
        gender: '',
        emailConfirmed: false
    });

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    useEffect(() => {
        getProvince();
        handleGetDataUser();
    }, []);

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

    const getProvince = async () => {
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm')
        setListProvince(response.data.data)
    }

    const getDistrict = async (province) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${province}.htm`);
        setListDistrict(response.data.data)
    }

    const getWard = async (district) => {
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${district}.htm`);
        setListWard(response.data.data)
    }

    const getFullLocation = async (ward) => {
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
    };

    const handleSpecificAddressChange = (e) => {
        setSpecificAddress(e.target.value);
    };

    const handleGetDataUser = async () => {
        const response = await getInforUser();
        setDataUser(response);
        setDetailLocaton(response.address)
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
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (!dataUser.phoneNumber || !dataUser.address) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }

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
                setCooldown(60);
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
        <div className="update-profile-lux">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="container">
                <div className="profile-card-premium">
                    <div className="profile-header-lux">
                        <h1>Sửa hồ sơ cá nhân</h1>
                        <p>Thông tin của bạn giúp chúng tôi cung cấp dịch vụ tốt hơn.</p>
                    </div>

                    <div className="profile-form-body">
                        <form onSubmit={handleSubmit}>
                            {/* Personal Details */}
                            <h3 className="profile-section-title">Thông tin cơ bản</h3>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="lux-input-group">
                                        <label className="lux-label">Tên người dùng</label>
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                id="userName"
                                                className="lux-input readonly"
                                                value={dataUser.userName}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="lux-input-group">
                                        <label className="lux-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            className="lux-input"
                                            value={dataUser.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="lux-input-group">
                                        <label className="lux-label">Địa chỉ email</label>
                                        <div className="email-box-premium">
                                            <input
                                                type="email"
                                                id="email"
                                                className="lux-input readonly"
                                                value={dataUser.email}
                                                readOnly
                                            />
                                            {!dataUser.emailConfirmed && (
                                                <button
                                                    type="button"
                                                    onClick={handleConfirmEmail}
                                                    disabled={cooldown > 0 || emailLoading}
                                                    className="btn-confirm-email-lux"
                                                >
                                                    {emailLoading ? <Loader2 className="animate-spin" size={18} /> : (cooldown > 0 ? `Thử lại sau ${cooldown}s` : 'Xác thực ngay')}
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-2 d-flex align-items-center gap-1">
                                            {dataUser.emailConfirmed ? (
                                                <div className="status-valid d-flex align-items-center gap-1 small fw-bold">
                                                    <CheckCircle2 size={14} /> Đã xác thực
                                                </div>
                                            ) : (
                                                <div className="status-invalid d-flex align-items-center gap-1 small fw-bold">
                                                    <AlertCircle size={14} /> Chưa xác thực email
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lux-input-group">
                                <label className="lux-label">Giới tính</label>
                                <select
                                    id="gender"
                                    className="lux-select"
                                    value={dataUser.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="true">Nam</option>
                                    <option value="false">Nữ</option>
                                    <option value="">Khác</option>
                                </select>
                            </div>

                            {/* Address Details */}
                            <h3 className="profile-section-title mt-5">Địa chỉ giao hàng</h3>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="lux-input-group">
                                        <label className="lux-label">Tỉnh / Thành phố</label>
                                        <select className="lux-select" onChange={handleProvinceChange} value={province}>
                                            <option value="">Chọn tỉnh thành</option>
                                            {listProvince.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="lux-input-group">
                                        <label className="lux-label">Quận / Huyện</label>
                                        <select className="lux-select" disabled={!province} onChange={handleDistrictChange} value={district}>
                                            <option value="">Chọn quận huyện</option>
                                            {listDistrict.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="lux-input-group">
                                        <label className="lux-label">Phường / Xã</label>
                                        <select className="lux-select" disabled={!district} onChange={handleWardChange} value={ward}>
                                            <option value="">Chọn phường xã</option>
                                            {listWard.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="lux-input-group">
                                <label className="lux-label">Số nhà, tên đường</label>
                                <input
                                    type="text"
                                    className="lux-input"
                                    onChange={handleSpecificAddressChange}
                                    value={specificAddress}
                                    placeholder="Ví dụ: 123 Đường ABC..."
                                />
                            </div>

                            <div className="lux-input-group">
                                <label className="lux-label">Địa chỉ đầy đủ (Ghi nhận trên hệ thống)</label>
                                <textarea
                                    className="lux-textarea"
                                    value={detailLocaton}
                                    disabled
                                    placeholder="Địa chỉ hoàn chỉnh sẽ hiển thị tại đây"
                                />
                            </div>

                            <div className="profile-footer-lux">
                                <button
                                    type="submit"
                                    className="btn-save-profile"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    <span>Lưu thay đổi hồ sơ</span>
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