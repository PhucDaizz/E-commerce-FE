import React, { useState, useEffect } from 'react'

const WeightCargoForm = ({ orderDetail, onDimensionsChange, isWeightCargo }) => {
    const [itemDimensions, setItemDimensions] = useState([]);

    useEffect(() => {
        if (isWeightCargo && orderDetail?.getOrderDetailDTO) {
            // Khởi tạo dimensions cho mỗi sản phẩm
            const initialDimensions = orderDetail.getOrderDetailDTO.map((detail, index) => ({
                productID: detail.productDTO.productID,
                productName: `${detail.productDTO.productName} - ${detail.productSizeDTO.colorName} - Size: ${detail.productSizeDTO.size}`,
                quantity: detail.quantity,
                length: 20,
                width: 18,
                height: 7,
                weight: 600
            }));
            setItemDimensions(initialDimensions);
            onDimensionsChange(initialDimensions);
        }
    }, [isWeightCargo, orderDetail]);

    const handleDimensionChange = (index, field, value) => {
        const updatedDimensions = [...itemDimensions];
        updatedDimensions[index] = {
            ...updatedDimensions[index],
            [field]: parseInt(value) || 0
        };
        setItemDimensions(updatedDimensions);
        onDimensionsChange(updatedDimensions);
    };

    if (!isWeightCargo || !orderDetail?.getOrderDetailDTO) {
        return null;
    }

    return (
        <div className="weight-cargo-form mb-3 mt-3">
            <div className="alert alert-info">
                <h6 className="fw-bold mb-2">📦 Hàng Nặng - Nhập Kích Thước Chi Tiết</h6>
                <p className="mb-0">Vì đây là hàng nặng, bạn cần nhập kích thước cho từng sản phẩm:</p>
            </div>

            <div className="row">
                <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">
                        Danh sách sản phẩm ({orderDetail.getOrderDetailDTO.length} sản phẩm)
                    </h6>
                </div>
            </div>

            {orderDetail.getOrderDetailDTO.map((detail, index) => (
                <div key={detail.productDTO.productID} className="card mb-3 shadow-sm">
                    <div className="card-header bg-light">
                        <div className="row align-items-center text-white">
                            <div className="col-md-8">
                                <h6 className="mb-1 fw-bold">
                                    {detail.productDTO.productName}
                                </h6>
                                <small className="">
                                    Màu: {detail.productSizeDTO.colorName} | 
                                    Size: {detail.productSizeDTO.size} | 
                                    Số lượng: {detail.quantity}
                                </small>
                            </div>
                            <div className="col-md-4 text-end">
                                <span className="badge bg-primary fs-6">
                                    {detail.unitPrice.toLocaleString()} VNĐ
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Chiều dài (cm) <span className="text-danger">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    value={itemDimensions[index]?.length || 20}
                                    onChange={(e) => handleDimensionChange(index, 'length', e.target.value)}
                                    placeholder="Nhập chiều dài"
                                    min="1"
                                    max="200"
                                    required
                                />
                                <small className="text-muted">Tối đa: 200cm</small>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Chiều rộng (cm) <span className="text-danger">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    value={itemDimensions[index]?.width || 18}
                                    onChange={(e) => handleDimensionChange(index, 'width', e.target.value)}
                                    placeholder="Nhập chiều rộng"
                                    min="1"
                                    max="200"
                                    required
                                />
                                <small className="text-muted">Tối đa: 200cm</small>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Chiều cao (cm) <span className="text-danger">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    value={itemDimensions[index]?.height || 7}
                                    onChange={(e) => handleDimensionChange(index, 'height', e.target.value)}
                                    placeholder="Nhập chiều cao"
                                    min="1"
                                    max="200"
                                    required
                                />
                                <small className="text-muted">Tối đa: 200cm</small>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Cân nặng (g) <span className="text-danger">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    value={itemDimensions[index]?.weight || 600}
                                    onChange={(e) => handleDimensionChange(index, 'weight', e.target.value)}
                                    placeholder="Nhập cân nặng"
                                    min="1"
                                    max="50000"
                                    required
                                />
                                <small className="text-muted">Tối đa: 50,000g</small>
                            </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-light rounded">
                            <small className="text-muted">
                                <strong>Thể tích:</strong> {
                                    ((itemDimensions[index]?.length || 20) * 
                                     (itemDimensions[index]?.width || 18) * 
                                     (itemDimensions[index]?.height || 7) / 1000).toFixed(2)
                                } dm³
                            </small>
                        </div>
                    </div>
                </div>
            ))}

            <div className="alert alert-warning mt-3">
                <small>
                    <strong>Lưu ý:</strong> Với hàng nặng, bạn bắt buộc phải nhập đầy đủ thông tin kích thước 
                    (chiều dài, chiều rộng, chiều cao, cân nặng) cho từng sản phẩm.
                </small>
            </div>
        </div>
    );
}

export default WeightCargoForm