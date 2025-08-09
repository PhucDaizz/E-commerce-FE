import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../Context/DashboardContext';
import { Box, Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import './TrendChart.css';

const TrendChart = () => {
    const apiUrl = import.meta.env.VITE_BASE_API_URL;
    const { getReportTopSelling } = useDashboard();
    const [itemTopSelling, setItemTopSelling] = useState(5);
    const [dataTopSelling, setDataTopSelling] = useState([]);

    const handleGetTopSelling = async (item) => {
        try {
            const response = await getReportTopSelling(item);
            if (response.status === 200) {
                setDataTopSelling(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy top sản phẩm:', error);
        }
    };

    useEffect(() => {
        handleGetTopSelling(itemTopSelling);
    }, [itemTopSelling]);

    const handleChangGetTopSelling = (e) => {
        setItemTopSelling(Number(e.target.value));
    };


    const resolveImageUrl = (imageUrl) => {
        return imageUrl.includes('cloudinary.com') ? imageUrl : `${apiUrl}/${imageUrl}`;
    };


    // Hàm lấy URL ảnh chính từ mảng images
    const getPrimaryImageUrl = (images) => {
        const primaryImage = images?.find(img => img.isPrimary);
        return primaryImage ? resolveImageUrl(primaryImage.imageURL) : 'placeholder-image.jpg'; // Ảnh mặc định nếu không có
    };

    return (
        <Box className="trend-chart" sx={{ py: 4, bgcolor: '#f5f7fa' }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardHeader
                    title={
                        <Typography variant="h6" component="div" fontWeight="bold" color="white">
                            <i className="bi bi-bar-chart-line me-2"></i> Top Sản Phẩm Bán Chạy
                        </Typography>
                    }
                    sx={{ bgcolor: 'linear-gradient(135deg, #007bff, #00c4ff)', p: 2 }}
                />
                <CardContent sx={{ p: 4 }}>
                    {/* Dropdown */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                            Hiển thị Top:
                        </Typography>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="top-sell-label">Số lượng</InputLabel>
                            <Select
                                labelId="top-sell-label"
                                id="topSell"
                                value={itemTopSelling}
                                label="Số lượng"
                                onChange={handleChangGetTopSelling}
                                sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Biểu đồ */}
                    {dataTopSelling.length > 0 ? (
                        <Box sx={{ mb: 4 }}>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: dataTopSelling.map(item => item.productName), label: 'Sản phẩm' }]}
                                series={[{ data: dataTopSelling.map(item => item.totalSelling), label: 'Số lượng bán', color: '#007bff' }]}
                                height={300}
                                sx={{ '& .MuiChartsAxis-label': { fontWeight: 'bold' } }}
                            />
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                            Chưa có dữ liệu để hiển thị biểu đồ
                        </Typography>
                    )}

                    {/* Danh sách với ảnh */}
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {dataTopSelling.length > 0 ? (
                            dataTopSelling.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        py: 2,
                                        borderBottom: '1px solid #e0e0e0',
                                        '&:hover': { bgcolor: '#f8f9fa' },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {/* Ảnh sản phẩm */}
                                        <Box
                                            component="img"
                                            src={getPrimaryImageUrl(item.images)}
                                            alt={item.productName}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                mr: 2,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" color="info.main">
                                                {index + 1}. {item.productName} 
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Giá: {item.price ? item.price.toLocaleString() : 'N/A'} VNĐ 
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            bgcolor: 'info.main',
                                            color: 'white',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 10,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {item.totalSelling} sản phẩm
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Chưa có dữ liệu
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TrendChart;