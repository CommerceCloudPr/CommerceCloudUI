'use client'
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ 
  currentPage = 0, 
  totalPages = 0, 
  totalElements = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange 
}) => {
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  // Base-UI Default Pagination Style - Simple page numbers
  const getPageItems = () => {
    const items = [];
    const maxVisible = 5; // Show max 5 pages like base-UI
    const startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <BootstrapPagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </BootstrapPagination.Item>
      );
    }
    
    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="d-flex flex-column align-items-end gap-2">
      <nav aria-label="Page navigation">
        <BootstrapPagination>
          <BootstrapPagination.Prev 
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </BootstrapPagination.Prev>
          
          {getPageItems()}
          
          <BootstrapPagination.Next 
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </BootstrapPagination.Next>
        </BootstrapPagination>
      </nav>

      {/* Total Count Below Pagination */}
      <div className="text-muted text-end">
        Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
      </div>
    </div>
  );
};

export default Pagination;
