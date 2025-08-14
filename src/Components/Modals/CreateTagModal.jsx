import React, { useState } from 'react';
import { useTagContext } from '../../Context/TagContext';
import { toast } from 'react-toastify';

const CreateTagModal = ({ show, onHide, onCreateSuccess }) => {
  const [tagName, setTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { createTag } = useTagContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createTag({ tagName: tagName });

      if (!response.ok) {
        throw new Error('Failed to create tag');
      }

      const newTag = await response.json();
      onCreateSuccess(newTag);
      handleClose();
    } catch (err) {
      setError(err.response.data.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTagName('');
    setError(null);
    onHide();
  };

  return (
    <div className={`modal ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Tag</h5>
            <button 
              type="button" 
              className="close" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <span>&times;</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="form-group">
                <label>Tag Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Enter tag name"
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !tagName}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Tag'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTagModal;