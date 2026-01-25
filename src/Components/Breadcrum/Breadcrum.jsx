import React from 'react';
import './Breadcrum.css';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrum = (props) => {
    return (
        <nav className='breadcrum-wrapper' aria-label="Breadcrumb">
            <div className='breadcrum-content container'>
                <Link to='/' className="breadcrum-home">
                    <Home size={14} />
                    <span>TRANG CHỦ</span>
                </Link>

                {props.categoryname && (
                    <div className="breadcrum-item">
                        <ChevronRight size={14} className="separator" />
                        <span className="category-name">{props.categoryname}</span>
                    </div>
                )}

                {props.productName && (
                    <div className="breadcrum-item">
                        <ChevronRight size={14} className="separator" />
                        <span className="product-name">{props.productName}</span>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Breadcrum;
