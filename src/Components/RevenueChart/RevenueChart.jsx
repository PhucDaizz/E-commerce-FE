import { Box, Card, CardContent, Chip, CircularProgress, Grid2, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import axios from 'axios';
import { Calendar, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDashboard } from '../../Context/DashboardContext';

const RevenueChart = () => {
    const { getReportRevenue } = useDashboard();
    const [periodType, setPeriodType] = useState('DAILY');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRevenueData = async (type) => {
    try {
        setLoading(true);
        setError(null);
        
        const response = await getReportRevenue(type);
        setData(response.data);
    } catch (err) {
        setError('Không thể tải dữ liệu doanh thu');
        console.error('Error fetching revenue data:', err);
    } finally {
        setLoading(false);
    }
  };

    useEffect(() => {
        fetchRevenueData(periodType);
    }, [periodType]);

    const handlePeriodChange = (event, newPeriod) => {
        if (newPeriod !== null) {
        setPeriodType(newPeriod);
        }
    };

    const renderChart = () => {
        if (!data || !data.revenues || data.revenues.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="text.secondary">Không có dữ liệu để hiển thị</Typography>
            </Box>
        );
    }

    const isDaily = periodType === 'DAILY';
    const chartData = data.revenues;
        
    const xAxisData = chartData.map(item => 
        isDaily ? item.label : item.label
    );
    
    const seriesData = chartData.map(item => item.revenue);

    // Màu sắc cho biểu đồ
    const colors = seriesData.map(value => 
        value > 0 ? '#4caf50' : '#9e9e9e'
    );

    const chartProps = {
        series: [
            {
            data: seriesData,
            color: '#1976d2',
            },
        ],
        height: 400,
        margin: { left: 70, right: 20, top: 20, bottom: 50 },
    };
        


  return (
      <Box>
        {/* Thông tin tổng quan */}
        <Grid2 container spacing={2} sx={{ mb: 3 }}>
          <Grid2 item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Tổng doanh thu
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(data.totalRevenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Khoảng thời gian
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {data.periodRange}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* Biểu đồ */}
        {isDaily ? (
          <BarChart
            {...chartProps}
            xAxis={[
              {
                data: xAxisData,
                scaleType: 'band',
                label: 'Ngày',
                tickLabelStyle: {
                  angle: 45,
                  textAnchor: 'start',
                  fontSize: 12
                }
              },
            ]}
            yAxis={[
              {
                label: 'Doanh thu (VND)',
                valueFormatter: (value) => 
                  new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    notation: 'compact'
                  }).format(value)
              }
            ]}
            tooltip={{ 
              trigger: 'item',
              valueFormatter: (value) => 
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(value)
            }}
          />
        ) : (
          <LineChart
            {...chartProps}
            xAxis={[
              {
                data: xAxisData,
                scaleType: 'point',
                label: 'Tháng',
              },
            ]}
            yAxis={[
              {
                label: 'Doanh thu (VND)',
                valueFormatter: (value) => 
                  new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    notation: 'compact'
                  }).format(value)
              }
            ]}
            tooltip={{ 
              trigger: 'item',
              valueFormatter: (value) => 
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(value)
            }}
          />
        )}

        {/* Chi tiết dữ liệu */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chi tiết doanh thu
          </Typography>
          <Grid2 container spacing={1}>
            {chartData.map((item, index) => (
              <Grid2 item xs={6} sm={4} md={2} key={index}>
                <Card variant="outlined" sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    {isDaily ? item.dayOfWeek : item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {isDaily ? item.label : `/${item.year}`}
                  </Typography>
                  <Chip
                    size="small"
                    label={new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      notation: 'compact'
                    }).format(item.revenue)}
                    color={item.revenue > 0 ? 'success' : 'default'}
                    sx={{ mt: 0.5 }}
                  />
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp size={24} />
            <Typography variant="h5" component="h2" fontWeight="bold">
              Thống kê doanh thu
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={periodType}
            exclusive
            onChange={handlePeriodChange}
            aria-label="Chọn chu kỳ"
          >
            <ToggleButton value="DAILY" aria-label="Theo ngày">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Calendar size={16} />
                <Typography variant="body2">Theo ngày</Typography>
              </Box>
            </ToggleButton>
            <ToggleButton value="MONTHLY" aria-label="Theo tháng">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Calendar size={16} />
                <Typography variant="body2">Theo tháng</Typography>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Chart content */}
        {!loading && !error && renderChart()}
      </CardContent>
    </Card>
  );
};

export default RevenueChart
