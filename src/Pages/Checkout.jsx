import React, { useEffect, useState } from 'react';
import './CSS/Checkout.css';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartCheckout from '../Components/CartCheckout/CartCheckout';

const Checkout = () => {
    const {getInforUser} = useAuth();
    const navigation = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState("cod");
    const [dataCoupon, setDataCoupon] = useState({});
  
    const [detailLocaton, setDetailLocaton] = useState('');
    const [isFillFull, setIsFillFull] = useState(false);

    const [inforUser, setInforUser] = useState({});
    const [note, setNote] = useState(null);
    
    useEffect(() => {
        getInfor()
    }, [])

    const getInfor = async() => {
        let isLogIn = localStorage.getItem('token');
        if(isLogIn !== null) {
            let inf = await getInforUser();
            setInforUser(inf);
            if(inf.address !== null) {
                setDetailLocaton(inf.address);
                setIsFillFull(false);
            }
            else {
                setIsFillFull(true);
            }
            return inforUser;
        }
        navigation('/');
        return null;
    }

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    // const handlePayment = async() => {
    //     if (selectedMethod === 'vnpay') {

    //     }

    // }
    

    return (
        <div className='checkout container m-4 me-0 row' style={{minHeight: '80vh'}}>
            <div className="col">
                <h5 className="mb-3">Thông tin nhận hàng</h5>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={inforUser.email} placeholder='Địa chỉ email' readOnly disabled/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input type="text" className="form-control" value={inforUser.userName} placeholder="Nhập họ và tên" disabled/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input type="tel" value={inforUser.phoneNumber} className="form-control" placeholder="+84xxxxxxxxx" disabled/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Ghi chú (tùy chọn)</label>
                    <textarea className="form-control" 
                            placeholder="Nhập ghi chú nếu có" 
                            onChange={handleNoteChange}
                            value={note}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Địa chỉ của bạn là:</label>
                    <textarea type="text" className="form-control" value={detailLocaton} placeholder="Địa chỉ chi tiết" disabled/>
                </div>
                <div className="mb-3">
                    <button className='btn btn-outline-dark' onClick={() => navigation('/account/update')}>Thay đổi địa chỉ</button>
                </div>
            </div>
            <div className="col">
                <div className='p-4 pt-0'>
                    <h5>Vận chuyển</h5>
                    {
                        isFillFull ? (
                            <div className='require-info p-2 rounded-2'>
                                <p className='ms-2'>Vui lòng nhập thông tin giao hàng</p>
                            </div>
                        ) : (
                            <div className='border p-3 d-flex justify-content-between align-items-center'>
                                <p className='p-0 mb-0'>
                                    <i className="bi bi-check-circle me-1"></i>Giao hàng tận nơi
                                </p>
                                <p className='p-0 mb-0'>30.000đ</p>
                            </div>

                        )
                    }
                </div>
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
                            <i className="bi bi-cash-coin" style={{ marginLeft: "auto", fontSize: "1.5rem", color: "#007bff" }}></i>
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
            <div className="col">
                <CartCheckout 
                    dataCoupon={dataCoupon}  
                    setDataCoupon={setDataCoupon} 
                    selectedMethod={selectedMethod} 
                    note={note} 
                />
            </div>
        </div>
    );
}

export default Checkout;
