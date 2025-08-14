// Context/TagContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { apiRequest } from '../utils/apiHelper';

const TagContext = createContext();

export const TagProvider = ({ children }) => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createTag = async (tagData) => {
        setError(null);
        try {
            const response = await apiRequest({
                method: 'POST',
                url: '/api/Tag',
                data: tagData
            });
            setTags(prevTags => [...prevTags, response.data]);
            return response;
        } catch (error) {
            console.error('Error creating tag:', error);
            throw error;
        }
    }
    
    const updateTag = async (tagId, tagData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest({
                method: 'PUT',
                url: `api/Tag/Update/${tagId}`,
                data: tagData
            });
            setLoading(false);
            setTags(prevTags => 
                prevTags.map(tag => 
                    tag.tagID === tagId ? { ...tag, ...response.data } : tag
                )
            );
            return response;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error updating tag:', error);
            throw error;
        }
    }

    const deleteTag = async (tagId) => {
        setError(null);
        try {
            const response = await apiRequest({
                method: 'DELETE',
                url: `/api/Tag?id=${tagId}`
            });
            setTags(prevTags => prevTags.filter(tag => tag.tagID !== tagId));
            return response;
        } catch (error) {
            setError(error.message);
            console.error('Error deleting tag:', error);
            throw error;
        }
    }

    const getTags = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest({
                method: 'GET',
                url: '/api/Tag'
            });
            setTags(response.data);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error fetching tags:', error);
            throw error;
        }
    }

    const getTag = async (tagId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest({
                method: 'GET',
                url: `api/Tag/GetById/${tagId}`
            });
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error fetching tag:', error);
            throw error;
        }
    }

    const syncTagsToProduct = async (productId, listTagId) => {
        setError(null);
        try {
            const response = await apiRequest({
                method: 'PUT',
                url: `/api/Tag/products/${productId}/SyncProductTags`,
                data: listTagId
            });
            return response;
        } catch (error) {
            console.error('Error adding tag to product:', error);
            throw error;
        }
    }

    const getTagsByProduct = async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest({
                method: 'GET',
                url: `/api/Tag/GetTagsByProduct/${productId}`
            });
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error fetching tags for product:', error);
            throw error;
        }
    }

    return (
        <TagContext.Provider value={{
            createTag,
            updateTag,
            deleteTag,
            getTags,
            getTag,
            syncTagsToProduct,
            getTagsByProduct,
            loading,
            error,
            tags
        }}>
        {children}
        </TagContext.Provider>
    )
}

export const useTagContext = () => {
    return useContext(TagContext);
};