import React, { useEffect, useState } from 'react';
import { useShipping } from '../../Context/ShippingContext';
import { useAuth } from '../../Context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const OrderApproval = ({ dataOrder, orderDetail, onOrderApproved }) => {
    const { get_pick_shift, createShippingOrder, updateShipping } = useShipping();
    const { getInforById, getInforUser } = useAuth();

    const [dataPickShift, setDataPickShift] = useState([]);
    const [choosePickShift, setChoosePickShift] = useState(null);
    const [couponShip, setCouponShip] = useState('');
    const [requiredNote, setRequiredNote] = useState('');
    const [indexShift, setIndexShift] = useState(null);
    const [dataUser, setDataUser] = useState({});
    const [dataUserSend, setDataUserSend] = useState({});
    const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0, weight: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get_pick_shift();
                if (response.status === 200) {
                    setDataPickShift(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin ca lấy hàng:", error);
            }
        };

        const fetchUserInfo = async (userID) => {
            try {
                if (!userID) return;
                const response = await getInforById(userID);
                const userSendResponse = await getInforUser();
                if (response.status === 200) {
                    setDataUser(response.data);
                }
                setDataUserSend(userSendResponse);
            } catch (error) {
                console.error("Lỗi gọi thông tin KH:", error);
            }
        };

        fetchData();
        if (dataOrder?.userID) fetchUserInfo(dataOrder.userID);
    }, [dataOrder?.userID]);

    const handleChangePickShift = (event) => {
        const shiftId = Number(event.target.value);
        setIndexShift(shiftId);
        setChoosePickShift(dataPickShift.find(item => item.id === shiftId) || null);
    };

    const handleCheckDeliveryNotePermission = (event) => {
        setRequiredNote(event.target.value);
    };

    const handleDimensionChange = (e) => {
        setDimensions({ ...dimensions, [e.target.name]: e.target.value });
    };

    const sendToGHN = async () => {
        try {
            if (dataOrder.shippingDTO?.length > 0 && dataOrder.shippingDTO[0]?.shippingServicesID) {
                toast.error("Đơn hàng này đã được gửi trước đó!");
                return { success: false, message: "Đơn hàng đã được gửi" };
            }

            if (!dataOrder || !dataUser || !dataUserSend?.address || !requiredNote) {
                toast.error("Lỗi: Thiếu dữ liệu cần thiết để tạo đơn hàng");
                return { success: false, message: "Thiếu dữ liệu cần thiết để tạo đơn hàng" };
            }

            const convertedDimensions = {
                length: parseInt(dimensions.length, 10) || 0,
                width: parseInt(dimensions.width, 10) || 0,
                height: parseInt(dimensions.height, 10) || 0,
                weight: parseInt(dimensions.weight, 10) || 0
            };

            const response = await createShippingOrder(
                dataOrder,
                dataUser,
                dataUserSend.address,
                requiredNote,
                convertedDimensions,
                indexShift,
                couponShip
            );

            if (response && response.status === 200) {
                const responseUpdateShipping = await updateShipping(dataOrder.orderID, response.data);
                if (responseUpdateShipping.status !== 200) {
                    toast.error("Cập nhật data thất bại");
                    return { success: false, message: "Cập nhật thất bại" };
                }

                toast.success(response.data.message_display);
                toast.success(`Phí giao hàng bạn cần phải trả là: ${response.data.data.total_fee}`);
                onOrderApproved();

                return { success: true, data: response.data };
            } else {
                toast.error("Gửi đơn thất bại");
                return { success: false, message: "Gửi đơn thất bại", response };
            }
        } catch (error) {
            console.error("❌ Lỗi khi lên đơn: ", error);
            toast.error("Lỗi khi tạo đơn hàng");
            return { success: false, message: "Lỗi khi tạo đơn hàng", error };
        }
    };

    return (
        <div className='order-approval p-4 border rounded bg-light shadow-sm'>
            <ToastContainer />
            <h5 className='fw-bold mb-3 text-primary'>Duyệt đơn hàng</h5>

            {/* Chọn ca lấy hàng */}
            <div className="mb-3">
                <label className='fw-bold'>Ca lấy hàng:</label>
                <select className='form-select mt-2' onChange={handleChangePickShift}>
                    <option value="">-- Chọn ca lấy hàng --</option>
                    {dataPickShift.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hiển thị thông tin ca lấy hàng đã chọn */}
            {choosePickShift && (
                <div className="p-3 border rounded bg-white shadow-sm mb-3">
                    <h6 className='fw-bold'>Thông tin ca lấy hàng:</h6>
                    <p><strong>Ca:</strong> {choosePickShift.title}</p>
                    <p><strong>Thời gian:</strong> {choosePickShift.from_time} - {choosePickShift.to_time}</p>
                </div>
            )}

            {/* Quyền kiểm tra hàng */}
            <div className='mb-3'>
                <label className='fw-bold'>Quyền kiểm tra hàng:</label>
                <select className='form-select mt-2' onChange={handleCheckDeliveryNotePermission}>
                    <option value="">---</option>
                    <option value="CHOTHUHANG">Cho phép xem và thử hàng</option>
                    <option value="CHOXEMHANGKHONGTHU">Xem hàng nhưng không thử</option>
                    <option value="KHONGCHOXEMHANG">Không được phép xem hàng</option>
                </select>
            </div>

            {/* Kích thước đơn hàng */}
            <div className='mb-3'>
                <label className='fw-bold'>Kích thước đơn hàng:</label>
                <div className="row">
                    <div className='col-md-6'>
                        <label className='form-label'>Chiều dài (cm) - Tối đa: 200</label>
                        <input type='number' name="length" className='form-control' value={dimensions.length} onChange={handleDimensionChange} placeholder="Nhập chiều dài" required />
                    </div>
                    <div className='col-md-6'>
                        <label className='form-label'>Chiều rộng (cm) - Tối đa: 200</label>
                        <input type='number' name="width" className='form-control' value={dimensions.width} onChange={handleDimensionChange} placeholder="Nhập chiều rộng" required />
                    </div>
                    <div className='col-md-6 mt-2'>
                        <label className='form-label'>Chiều cao (cm) - Tối đa: 200</label>
                        <input type='number' name="height" className='form-control' value={dimensions.height} onChange={handleDimensionChange} placeholder="Nhập chiều cao" required />
                    </div>
                    <div className='col-md-6 mt-2'>
                        <label className='form-label'>Cân nặng (g) - Tối đa: 50.000</label>
                        <input type='number' name="weight" className='form-control' value={dimensions.weight} onChange={handleDimensionChange} placeholder="Nhập cân nặng" required />
                    </div>
                </div>
            </div>

            {/* Mã giảm giá bên ship */}
            <div className='mb-3'>
                <label className='fw-bold'>Voucher bên ship:</label>
                <input type='text' className='form-control mt-2' maxLength={20} placeholder="Nhập mã giảm giá" value={couponShip} onChange={e => setCouponShip(e.target.value)} />
            </div>

            {/* Nút gửi đơn hàng */}
            <div>
                <button className='btn btn-success w-100' onClick={() => sendToGHN()}>Gửi đơn hàng</button>
            </div>
        </div>
    );
};

export default OrderApproval;
