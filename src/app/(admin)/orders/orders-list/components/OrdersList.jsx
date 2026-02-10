'use client';

import { useState, useMemo } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ordersListData } from '../data';
import OrdersFilter from './OrdersFilter';
import Link from 'next/link';
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  Row,
  Form,
  Badge,
  Button,
  InputGroup
} from 'react-bootstrap';

const OrdersList = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return ordersListData;
    
    const query = searchQuery.toLowerCase();
    return ordersListData.filter(order => 
      order.id.toString().includes(query) ||
      order.referenceId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query)
    );
  }, [searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / pageSize);
  }, [filteredData.length, pageSize]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedData.map(order => order.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
    // API call will be made here
    console.log('Applied filters:', newFilters);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when page size changes
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      setSelectedOrders([]); // Clear selections when changing pages
      setSelectAll(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Order Received': { variant: 'info', icon: 'solar:clipboard-check-broken' },
      'Preparing': { variant: 'warning', icon: 'solar:box-broken' },
      'Shipped': { variant: 'primary', icon: 'solar:tram-broken' },
      'Delivered': { variant: 'success', icon: 'solar:check-circle-broken' },
      'Cancelled': { variant: 'danger', icon: 'solar:close-circle-broken' }
    };

    const config = statusConfig[status] || { variant: 'secondary', icon: 'solar:question-circle-broken' };

    return (
      <Badge bg={`${config.variant}-subtle`} text={config.variant} className="px-2 py-1">
        <IconifyIcon icon={config.icon} className="me-1" />
        {status}
      </Badge>
    );
  };

  const getPackagingStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { variant: 'secondary' },
      'Packaging': { variant: 'warning' },
      'Completed': { variant: 'success' },
      'Cancelled': { variant: 'danger' }
    };

    const config = statusConfig[status] || { variant: 'secondary' };

    return (
      <Badge bg={config.variant} className="px-2 py-1">
        {status}
      </Badge>
    );
  };

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              {/* Top Controls - Similar to Product List */}
              <div className="d-flex flex-column gap-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Page Size Selector */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Show</span>
                    <Form.Select
                      size="sm"
                      style={{ width: '80px' }}
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </Form.Select>
                    <span className="text-muted">entries</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowFilter(true)}>
                      <IconifyIcon icon="bx:filter-alt" className="me-1" />
                      Filters
                    </Button>
                    <Button variant="soft-success" size="sm">
                      <IconifyIcon icon="solar:export-broken" className="me-1" />
                      Export Excel
                    </Button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="row">
                  <div className="col-md-6">
                    <InputGroup>
                      <InputGroup.Text>
                        <IconifyIcon icon="solar:magnifer-broken" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by Order ID, Customer Name, Phone Number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: '50px' }}>
                        <Form.Check
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Phone Number</th>
                      <th>Order Amount</th>
                      <th>Total Amount</th>
                      <th>Order Source</th>
                      <th>Order Status</th>
                      <th>Packaging Status</th>
                      <th>Payment Type</th>
                      <th>Cargo</th>
                      <th>Store Rejection</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan="13" className="text-center py-5">
                          <div className="text-muted">
                            <IconifyIcon icon="solar:inbox-broken" className="fs-48 mb-3" />
                            <p className="mb-0">No orders found</p>
                            {searchQuery && (
                              <small>Try adjusting your search or filters</small>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((order, idx) => (
                        <tr key={idx}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                          />
                        </td>
                        <td>
                          <div>
                            <span className="fw-semibold">{order.id}</span>
                            <br />
                            <small className="text-muted">({order.referenceId})</small>
                          </div>
                        </td>
                        <td>
                          <Link href={`/customer/customer-detail/${order.id}`} className="text-dark fw-medium">
                            {order.customerName}
                          </Link>
                        </td>
                        <td>
                          <span className="text-muted">{order.phone}</span>
                        </td>
                        <td>
                          <span className="text-primary fw-semibold">{formatCurrency(order.orderAmount)}</span>
                        </td>
                        <td>
                          <span className="text-success fw-semibold">{formatCurrency(order.totalAmount)}</span>
                        </td>
                        <td>
                          <Badge bg="primary-subtle" text="primary">
                            {order.source}
                          </Badge>
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{getPackagingStatusBadge(order.packagingStatus)}</td>
                        <td>
                          <span className="text-muted">{order.paymentType}</span>
                        </td>
                        <td>
                          <Badge bg="info-subtle" text="info">
                            {order.cargo}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {order.storeRejection ? (
                            <Badge bg="danger">
                              <IconifyIcon icon="solar:close-circle-broken" />
                            </Badge>
                          ) : (
                            <Badge bg="success">
                              <IconifyIcon icon="solar:check-circle-broken" />
                            </Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Link href={`/orders/order-detail/${order.id}`} className="btn btn-light btn-sm">
                              <IconifyIcon icon="solar:eye-broken" className="fs-16" />
                            </Link>
                            <Button variant="soft-primary" size="sm">
                              <IconifyIcon icon="solar:pen-2-broken" className="fs-16" />
                            </Button>
                            <Button variant="soft-info" size="sm">
                              <IconifyIcon icon="solar:printer-broken" className="fs-16" />
                            </Button>
                            <Button variant="soft-success" size="sm">
                              <IconifyIcon icon="solar:refresh-circle-broken" className="fs-16" />
                            </Button>
                            <Button variant="soft-danger" size="sm">
                              <IconifyIcon icon="solar:trash-bin-minimalistic-broken" className="fs-16" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>

            <CardFooter className="border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  {selectedOrders.length > 0 ? (
                    <span>
                      <strong>{selectedOrders.length}</strong> orders selected
                    </span>
                  ) : (
                    <span>
                      Showing {filteredData.length === 0 ? 0 : currentPage * pageSize + 1} to{' '}
                      {Math.min((currentPage + 1) * pageSize, filteredData.length)} of {filteredData.length} entries
                    </span>
                  )}
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                      <Button
                        variant="link"
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                    </li>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                      // Show first page, last page, current page and adjacent pages
                      if (
                        page === 0 ||
                        page === totalPages - 1 ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <Button
                              variant="link"
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page + 1}
                            </Button>
                          </li>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <li key={page} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                      <Button
                        variant="link"
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* Filter Offcanvas */}
      <OrdersFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onFilter={handleFilterChange}
      />
    </>
  );
};

export default OrdersList;