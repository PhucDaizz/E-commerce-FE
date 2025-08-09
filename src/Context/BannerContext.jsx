import React, { createContext, useContext, useState } from 'react'
import { apiMultipartRequest, apiRequest } from '../utils/apiHelper';
import axios from '../api/axios';

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
    const [banner, setBanner] = useState([]);
    const [banners, setBanners] = useState([]);
    const [bannersAdmin, setBannersAdmin] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBanner = async (bannerData) => {
        try {
            setIsLoading(true);
            
            const formData = new FormData();
            
            // Validate required fields
            if (!bannerData.title?.trim()) {
                throw new Error('Title is required');
            }
            
            if (!bannerData.imageFile) {
                throw new Error('Image file is required');
            }
            
            console.log('Creating banner with data:', bannerData);
            console.log('File details:', {
                name: bannerData.imageFile.name,
                size: bannerData.imageFile.size,
                type: bannerData.imageFile.type,
                lastModified: bannerData.imageFile.lastModified
            });
            
            // Append form fields theo đúng thứ tự
            formData.append('Title', bannerData.title.trim());
            formData.append('Description', bannerData.description?.trim() || '');
            formData.append('RedirectUrl', bannerData.redirectUrl || '');
            formData.append('IsActive', bannerData.isActive);
            formData.append('DisplayOrder', bannerData.displayOrder);
            formData.append('UseCloudStorage', bannerData.useCloudStorage);
            
            // Handle dates
            if (bannerData.startDate) {
                formData.append('StartDate', new Date(bannerData.startDate).toISOString());
            }
            
            if (bannerData.endDate) {
                formData.append('EndDate', new Date(bannerData.endDate).toISOString());
            }
            
            // Append file CUỐI CÙNG
            formData.append('ImageFile', bannerData.imageFile);

            // Debug FormData
            console.log('=== FormData Content ===');
            for (let [key, value] of formData.entries()) {
                if (key === 'ImageFile') {
                    console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
                } else {
                    console.log(`${key}: "${value}"`);
                }
            }
            console.log('========================');

            // Gọi API với apiMultipartRequest
            const response = await apiMultipartRequest({
                method: 'POST',
                url: '/api/Banner',
                data: formData,
            });
            
            console.log('✅ Banner created successfully:', response.data);
            return response.data;
            
        } catch (err) {
            console.error('❌ Create banner failed:', err);
            
            let errorMessage = 'Failed to create banner';
            
            if (err.response) {
                console.error('Response error:', {
                    status: err.response.status,
                    statusText: err.response.statusText,
                    data: err.response.data,
                    headers: err.response.headers
                });
                
                if (err.response.data?.errors) {
                    // Handle validation errors
                    errorMessage = Object.entries(err.response.data.errors)
                        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                        .join('; ');
                } else if (err.response.data?.title) {
                    errorMessage = err.response.data.title;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllBanners = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/Banner');
            setBanners(response.data);
            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to fetch banners');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getAllBannersAdmin = async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest({
                method: 'get',
                url: '/api/Banner'
            });
            setBannersAdmin(response.data);
            return response.data;
        } catch (error) {
            setError(error.message || 'Failed to fetch banners');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const deleteBanner = async (bannerId) => {
        setIsLoading(true);
        try {
            const response = await apiRequest({
                method: 'delete',
                url: `/api/Banner/?id=${bannerId}`
            });
            setBannersAdmin(prevBanners => prevBanners.filter(banner => banner.id !== bannerId));
            return response.data;
        } catch (error) {
            setError(error.message || 'Failed to delete banner');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const changeStatusBanner = async (bannerId) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: `/api/Banner/change-status?id=${bannerId}`
            });
            setBannersAdmin(prevBanners => 
                prevBanners.map(banner => 
                    banner.id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
                )
            );
            return response.data;
        } catch (error) {
            setError(error.message || 'Failed to change banner status');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const getBannerById = async (bannerId) => {
        try {
            const response = await apiRequest({
                method: 'get',
                url: `/api/Banner/${bannerId}`
            });
            setBanner(response.data);
            return response.data;
        } catch (error) {
            setError(error.message || 'Failed to fetch banner');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const updateBanner = async (bannerId, bannerData) => {
        try {
            const formData = new FormData();

            // Validate required fields
            if (!bannerData.title?.trim()) {
                throw new Error('Title is required');
            }

            // Append form fields
            formData.append('Title', bannerData.title.trim());
            formData.append('Description', bannerData.description?.trim() || '');
            formData.append('RedirectUrl', bannerData.redirectUrl || '');
            formData.append('IsActive', bannerData.isActive);
            formData.append('DisplayOrder', bannerData.displayOrder);
            formData.append('UseCloudStorage', bannerData.useCloudStorage || false);

            if (bannerData.startDate) {
                formData.append('StartDate', new Date(bannerData.startDate).toISOString());
            }

            if (bannerData.endDate) {
                formData.append('EndDate', new Date(bannerData.endDate).toISOString());
            }

            // Append file hoặc imageUrl
            if (bannerData.imageFile) {
                formData.append('ImageFile', bannerData.imageFile);
            } else if (bannerData.imageUrl) {
                formData.append('ImageUrl', bannerData.imageUrl);
            }

            // Gọi API
            const response = await apiMultipartRequest({
                method: 'PUT',
                url: `/api/Banner/${bannerId}`,
                data: formData,
            });

            const updatedBanner = response.data;
            setBannersAdmin(prevBanners => 
                prevBanners.map(banner => 
                    banner.id === bannerId ? updatedBanner : banner
                )
            );
            return {
                updatedBanner
            };

        } catch (err) {
            let errorMessage = 'Failed to update banner';

            if (err.response) {
                if (err.response.data?.errors) {
                    errorMessage = Object.entries(err.response.data.errors)
                        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                        .join('; ');
                } else if (err.response.data?.title) {
                    errorMessage = err.response.data.title;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <BannerContext.Provider value={{
            createBanner,
            getAllBanners,
            getAllBannersAdmin,
            deleteBanner,
            changeStatusBanner,
            getBannerById,
            updateBanner,
            banner,
            banners,
            bannersAdmin,
            isLoading,
            error
        }}>
            {children}
        </BannerContext.Provider>
    )
}

export const useBannerContext = () => {
    return useContext(BannerContext);
}
