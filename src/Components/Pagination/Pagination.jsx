import React from 'react';
import './Pagination.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleClick = (page) => {
    if (page !== '...') {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn pagination-nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
        <span className="nav-label">Trước</span>
      </button>

      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handleClick(page)}
          className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'pagination-dots' : ''}`}
          disabled={page === currentPage || page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn pagination-nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="nav-label">Sau</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
