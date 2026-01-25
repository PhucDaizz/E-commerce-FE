import React from 'react';
import { Truck, RefreshCw, CreditCard, Phone } from 'lucide-react';
import './ValuePropositionBar.css';

const propositions = [
  {
    icon: <Truck size={24} strokeWidth={1.5} />,
    title: 'Miễn phí vận chuyển',
    description: 'Cho mọi đơn hàng',
  },
  {
    icon: <RefreshCw size={24} strokeWidth={1.5} />,
    title: 'Đổi hàng tận nhà',
    description: 'Trong vòng 15 ngày',
  },
  {
    icon: <CreditCard size={24} strokeWidth={1.5} />,
    title: 'Thanh toán COD',
    description: 'Yên tâm mua sắm',
  },
  {
    icon: <Phone size={24} strokeWidth={1.5} />,
    title: 'Hotline Hỗ Trợ',
    description: '028.73066.XXX',
  },
];

const ValuePropositionBar = () => {
  return (
    <div className="proposition-bar-container">
      <div className="proposition-grid">
        {propositions.map((item, index) => (
          <div key={index} className="prop-item">
            <div className="prop-icon-wrapper">
              {item.icon}
            </div>
            <div className="prop-info">
              <h4 className="prop-title">{item.title}</h4>
              <p className="prop-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuePropositionBar;