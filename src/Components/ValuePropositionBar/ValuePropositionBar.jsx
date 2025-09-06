import React from 'react';
import { Truck, RefreshCw, CreditCard, Phone } from 'lucide-react';

// Dữ liệu cho từng mục trong thanh giá trị
const propositions = [
  {
    icon: <Truck size={30} />,
    title: 'Miễn phí vận chuyển',
    description: 'mọi đơn hàng',
  },
  {
    icon: <RefreshCw size={30} />,
    title: 'Đổi hàng tận nhà',
    description: 'trong vòng 15 ngày',
  },
  {
    icon: <CreditCard size={30} />,
    title: 'Thanh toán COD',
    description: 'yên tâm mua sắm',
  },
  {
    icon: <Phone size={30} />,
    title: 'Hotline: 028.73066.XXX',
    description: 'Hỗ trợ bạn từ 8h30-24h00',
  },
];

const ValuePropositionBar = () => {
  return (
    <div className="container-fluid py-3 border-top border-bottom">
      <div className="d-flex row justify-content-center">
        {propositions.map((item, index) => (
          <div key={index} className="col-lg-3 col-md-6 col-6 d-flex align-items-center my-2 justify-content-center">
            {/* Đổi col-12 thành col-6 */}
            <div className="text-primary me-3 d-flex align-items-center">
              {item.icon}
            </div>
            <div className="text-center">
              <p className="fw-bold mb-0">{item.title}</p>
              <p className="text-muted mb-0">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuePropositionBar;