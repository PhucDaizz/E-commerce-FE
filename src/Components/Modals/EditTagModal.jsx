import React, { useState, useEffect } from 'react';
import { useTagContext } from '../../Context/TagContext';

const EditTagModal = ({ 
show, 
onHide, 
tagId, 
currentTag, 
onUpdateSuccess 
}) => {
const [tagName, setTagName] = useState('');
const [originalTagName, setOriginalTagName] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const { getTag, updateTag } = useTagContext();

// Lấy thông tin tag khi mở modal
useEffect(() => {
    if (show) {
    if (currentTag) {
        // Nếu đã có sẵn thông tin tag
        setTagName(currentTag.tagName);
        setOriginalTagName(currentTag.tagName);
    } else if (tagId) {
        // Nếu không có thì fetch từ API
        fetchTagDetails();
    }
    }
}, [show, tagId, currentTag]);

const fetchTagDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
    const response = await getTag(tagId);
    setTagName(response.tagName);
    setOriginalTagName(response.tagName);
    } catch (err) {
    setError(err.message);
    } finally {
    setIsLoading(false);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
    const response = await updateTag(tagId, { tagName: tagName });

    onUpdateSuccess(response);
    handleClose();
    } catch (err) {
    setError(err.message || 'Something went wrong');
    } finally {
    setIsLoading(false);
    }
};

const handleClose = () => {
    setTagName('');
    setOriginalTagName('');
    setError(null);
    onHide();
};

return (
    <div className={`modal ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">Edit Tag</h5>
            <button 
            type="button" 
            className="close" 
            onClick={handleClose}
            disabled={isLoading}
            >
            <span>&times;</span>
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="modal-body">
            {isLoading && !tagName ? (
                <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading tag details...</p>
                </div>
            ) : (
                <>
                {error && (
                    <div className="alert alert-danger">
                    {error}
                    <button 
                        className="btn btn-sm btn-link" 
                        onClick={fetchTagDetails}
                    >
                        Retry
                    </button>
                    </div>
                )}
                
                <div className="form-group">
                    <label>Tag Name</label>
                    <input
                    type="text"
                    className="form-control"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="Enter tag name"
                    required
                    disabled={isLoading}
                    />
                </div>
                </>
            )}
            </div>
            
            <div className="modal-footer">
            <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
                disabled={isLoading}
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || !tagName || tagName.trim() === originalTagName.trim()}
            >
                {isLoading ? (
                <>
                    <span className="spinner-border spinner-border-sm"></span> Updating...
                </>
                ) : 'Update Tag'}
            </button>
            </div>
        </form>
        </div>
    </div>
    </div>
);
};

export default EditTagModal;