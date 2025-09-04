import React, { useEffect, useState } from 'react';
import { useTagContext } from '../../Context/TagContext';
import CreateTagModal from '../../Components/Modals/CreateTagModal';
import { toast, ToastContainer } from 'react-toastify';
import DeleteConfirmationTagModal from '../../Components/Modals/DeleteConfirmationTagModal';
import EditTagModal from '../../Components/Modals/EditTagModal';

const TagList = () => {
    const { tags, loading, error, getTags, createTag, updateTag, deleteTag } = useTagContext();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);


    useEffect(() => {
        getTags();
    }, []);

    const handleCreateSuccess = (newTag) => {
        console.log('New tag created:', newTag);
    };

    const handleDeleteClick = (tag) => {
        setSelectedTag(tag);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTag) return;
        try {
            await deleteTag(selectedTag.tagID);
            setShowDeleteModal(false);
            setSelectedTag(null);
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleEditClick = (tag) => {
        setSelectedTag(tag);
        setShowEditModal(true);
    };

    const handleUpdateSuccess = (updatedTag) => {
        // Cập nhật tag trong state mà không cần gọi lại API
        
    };


    return (
        <div className="tag-admin container py-4">
            <ToastContainer/>
            <CreateTagModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreateSuccess={handleCreateSuccess}
            />
            <DeleteConfirmationTagModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                tagName={selectedTag?.tagName || ''}
                isLoading={loading}
            />

            <EditTagModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                tagId={selectedTag?.tagID}
                currentTag={selectedTag}
                onUpdateSuccess={handleUpdateSuccess}
            />

            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h1 className="h4 mb-0">Danh sách Tag</h1>
                <div className='btn-add add-product-btn'>
                    <button 
                        className="btn-primary btn-modern"
                        onClick={() => setShowCreateModal(true)} // Add your create tag function here
                        disabled={loading}
                    >
                        + Add New Tag
                    </button>
                </div>
                </div>
                
                <div className="card-body">
                {loading ? (
                    <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading tags...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                    <button className="btn btn-sm btn-outline-danger ms-2" onClick={getTags}>
                        Retry
                    </button>
                    </div>
                ) : (
                    <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Slug</th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tags.length > 0 ? (
                            tags.map(tag => (
                            <tr key={tag.tagID}>
                                <td>{tag.tagID}</td>
                                <td>{tag.tagName}</td>
                                <td>{tag.slug}</td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'center', 
                                        gap: '0.5rem',
                                        height: '100%', 
                                    }}>
                                        <button 
                                            style={{ width: '120px' }} 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEditClick(tag)} 
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            style={{ width: '120px' }} 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteClick(tag)}
                                            disabled={loading}
                                        >
                                            Xoá
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="4" className="text-center py-4">
                                No tags found
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default TagList;