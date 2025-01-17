import React from 'react'
import './Pagination.css'
const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    const generatePageNumbers = () => {
        const maxVisiblePages = 5; // Số lượng trang hiển thị tối đa (bao gồm dấu `...` nếu cần)
        const pages = [];
    
        if (totalPages <= maxVisiblePages) {
          // Nếu tổng số trang nhỏ hơn hoặc bằng maxVisiblePages, hiển thị tất cả các trang
          for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // Nếu tổng số trang lớn hơn maxVisiblePages, xử lý rút gọn
          const startPage = Math.max(2, currentPage - 1);
          const endPage = Math.min(totalPages - 1, currentPage + 1);
    
          pages.push(1); // Luôn thêm trang đầu tiên
    
          if (startPage > 2) {
            pages.push('...'); // Thêm dấu `...` trước các trang ở giữa
          }
    
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
    
          if (endPage < totalPages - 1) {
            pages.push('...'); // Thêm dấu `...` sau các trang ở giữa
          }
    
          pages.push(totalPages); // Luôn thêm trang cuối cùng
        }
    
        return pages;
      };
    
      const handleClick = (page) => {
        if (page !== '...') {
          onPageChange(page);
        }
      };


    return (
        <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>

      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handleClick(page)}
          disabled={page === currentPage || page === '...'}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
    )
}

export default Pagination
