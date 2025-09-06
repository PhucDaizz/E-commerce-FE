import { Box, Card, CircularProgress, Typography, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Chip, Paper } from '@mui/material';
import { DollarSign, Grid, MapPin, ShoppingCart, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDashboard } from '../../Context/DashboardContext';

const CustomerLocationAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { CustomerLocationAnalysis } = useDashboard();

    const fetchLocationData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await CustomerLocationAnalysis();
            setData(response.data);
        } catch (err) {
            setError('Không thể tải dữ liệu phân tích địa chỉ');
            console.error('Error fetching location data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocationData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
        </Box>
        );
    }

    if (error) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography color="error">{error}</Typography>
        </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <MapPin size={24} />
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Vị trí khách hàng thường đặt
                </Typography>
                </Box>

                {data && (
                <>
                    {/* Summary Cards */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <MapPin color="#1976d2" size={32} />
                            <Typography variant="h6" color="text.secondary">
                            Tổng tỉnh thành
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                            {data.totalLocations}
                            </Typography>
                        </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <ShoppingCart color="#2e7d32" size={32} />
                            <Typography variant="h6" color="text.secondary">
                            Tổng đơn hàng
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                            {data.totalOrders.toLocaleString()}
                            </Typography>
                        </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <DollarSign color="#ed6c02" size={32} />
                            <Typography variant="h6" color="text.secondary">
                            Tổng doanh thu
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                            {formatCurrency(data.totalRevenue)}
                            </Typography>
                        </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <User color="#9c27b0" size={32} />
                            <Typography variant="h6" color="text.secondary">
                            Tổng khách hàng
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                            {data.totalCustomers.toLocaleString()}
                            </Typography>
                        </CardContent>
                        </Card>
                    </Grid>
                    </Grid>

                    {/* Locations Table */}
                    <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Tỉnh/Thành phố</TableCell>
                            <TableCell align="right">Số đơn hàng</TableCell>
                            <TableCell align="right">Doanh thu</TableCell>
                            <TableCell align="right">Số khách hàng</TableCell>
                            <TableCell align="right">Đơn hàng trung bình</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.locations.map((location, index) => (
                            <TableRow key={index}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                                        {index + 1}
                                    </Avatar>
                                    <Typography fontWeight="bold">
                                        {location.province}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                <Chip 
                                label={location.orderCount.toLocaleString()} 
                                color="primary" 
                                variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight="bold">
                                {formatCurrency(location.totalRevenue)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {location.customerCount.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                                {formatCurrency(location.totalRevenue / location.orderCount)}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </>
                )}
            </CardContent>
        </Card>
    );
};

export default CustomerLocationAnalysis
