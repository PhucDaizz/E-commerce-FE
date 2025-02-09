import React, { useEffect, useState } from 'react';
import './CSS/Checkout.css';
import axios from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const {getInforUser} = useAuth();
    const navigation = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState("cod");
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

    const [inforUser, setInforUser] = useState({});
    
    useEffect(() => {
        getProvince();
        getInfor()
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
        setDetailLocaton(`${specificAddress || ''}, ${fullLocation || ''}`);
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
        console.log(response.data.data.full_name)
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

    const getInfor = async() => {
        let isLogIn = localStorage.getItem('token');
        if(isLogIn !== null) {
            let inf = await getInforUser();
            setInforUser(inf);
            console.log(inforUser);
            return inforUser;
        }
        navigation('/');
        return null;
    }

    return (
        <div className='checkout container m-4 row'>
            <div className="col">
                <h5 className="mb-3">Thông tin nhận hàng</h5>
                
                <div className="mb-3">
                    <label className="form-label">Số địa chỉ</label>
                    <select className="form-select">
                        <option>Địa chỉ khác...</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={inforUser.email} placeholder='Địa chỉ email' readOnly />
                </div>

                <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input type="text" className="form-control" value={inforUser.userName} placeholder="Nhập họ và tên" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input type="tel" value={inforUser.phoneNumber} className="form-control" placeholder="+84xxxxxxxxx" />
                </div>

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
                    <label className="form-label">Ghi chú (tùy chọn)</label>
                    <textarea className="form-control" placeholder="Nhập ghi chú nếu có"></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Địa chỉ của bạn là:</label>
                    <textarea type="text" className="form-control" value={detailLocaton} placeholder="Địa chỉ chi tiết" disabled/>
                </div>

            </div>
            <div className="col">
                <h5>Vận chuyển</h5>
                {
                    !isFillFull && (
                        <div className='require-info p-2 rounded-2'>
                            <p className='ms-2'>Vui lòng nhập thông tin giao hàng</p>
                        </div>
                    )
                }
                <div className="method-payment p-4">
                <h5 className='mb-3 mt-3'>Thanh toán</h5>

                <div className="border rounded">
                    <div 
                        className={`p-3 d-flex align-items-center ${selectedMethod === "vnpay" ? "bg-light" : ""}`} 
                        onClick={() => setSelectedMethod("vnpay")} 
                        style={{ cursor: "pointer" }}
                    >
                        <input 
                            type="radio" 
                            name="payment-method" 
                            id="vnpay" 
                            checked={selectedMethod === "vnpay"} 
                            onChange={() => setSelectedMethod("vnpay")} 
                            className="me-2"
                        />
                        <label htmlFor="vnpay" className="d-flex align-items-center w-100">
                            Thanh toán qua VNPAY-QR
                            <img src='https://downloadlogomienphi.com/sites/default/files/logos/download-logo-vector-vnpay-mien-phi.jpg' 
                                alt="VNPAY" style={{ marginLeft: "auto", width: 50 }} />
                        </label>
                    </div>
                    <div 
                        className={`p-3 d-flex align-items-center ${selectedMethod === "cod" ? "bg-light" : ""}`} 
                        onClick={() => setSelectedMethod("cod")} 
                        style={{ cursor: "pointer" }}
                    >
                        <input 
                            type="radio" 
                            name="payment-method" 
                            id="cod" 
                            checked={selectedMethod === "cod"} 
                            onChange={() => setSelectedMethod("cod")} 
                            className="me-2"
                        />
                        <label htmlFor="cod" className="d-flex align-items-center w-100">
                            Thanh toán khi giao hàng (COD)
                            {/* <FaMoneyBillWave style={{ marginLeft: "auto", fontSize: "1.5rem", color: "#007bff" }} /> */}
                        </label>
                    </div>
                </div>

                {selectedMethod === "cod" && (
                    <div className="alert alert-light mt-2">
                        Bạn chỉ phải thanh toán khi nhận được hàng
                    </div>
                )}
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
}

export default Checkout;
