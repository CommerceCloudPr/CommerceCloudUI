'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Card, CardHeader, CardTitle, Col, Row, Pagination } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageTItle from '@/components/PageTItle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner';
import { fetchBrand, deleteBrand } from '@/utils/brandApi';
import BrandFilter from './BrandFilter';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const BrandList = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({});

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sıralama
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const v1 = a[sortField]?.toLowerCase() || '';
      const v2 = b[sortField]?.toLowerCase() || '';
      if (v1 < v2) return sortOrder === 'asc' ? -1 : 1;
      if (v1 > v2) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, data]);

  // Sayfalama
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const fetchBrandsData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage - 1,
        size: pagination.pageSize,
        sortBy: 'createdAt',
        sortDirection: 'ASC',
        paginated: true,
        ...filters,
      };

      const res = await fetchBrand(params);
      const items = Array.isArray(res.items) ? res.items : [];
      setData(items);

      setPagination((prev) => ({
        ...prev,
        currentPage: res.page + 1 ?? prev.currentPage,
        pageSize: res.size ?? prev.pageSize,
        totalPages: res.totalPages ?? 0,
        totalElements: res.totalElements ?? items.length,
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      toastify({
        props: { type: 'error' },
        message: error.message || 'Brand yüklenirken hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters || {});
    setPage(1);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setLoading(true);
  };

  const handleDelete = async (uuid) => {
    if (!confirm('Bu brand\'i silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await deleteBrand(uuid);
      if (response.success) {
        toastify({
          props: { type: 'success' },
          message: response.message || 'Brand başarıyla silindi',
        });
        fetchBrandsData();
      } else {
        toastify({
          props: { type: 'error' },
          message: response.message || 'Brand silinirken hata oluştu',
        });
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toastify({
        props: { type: 'error' },
        message: error.message || 'Brand silinirken hata oluştu',
      });
    }
  };

  useEffect(() => {
    fetchBrandsData();
  }, [fetchBrandsData]);

  return (
    <>
      <PageTItle title="BRAND LIST" />
      <div className="d-flex flex-column gap-4 justify-content-start">
        <div className="d-flex justify-content-between w-100 align-items-center">
          {/* Page Size Selector */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Show</span>
            <select
              className="form-select form-select-sm"
              style={{ width: '80px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-muted">entries</span>
          </div>

          {/* Filter Button */}
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowFilter(true)}
            >
              <IconifyIcon icon="bx:filter-alt" className="me-1" />
              Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '400px' }}
          >
            <Spinner />
          </div>
        ) : (
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    <CardTitle as={'h4'} className="mb-0">All Brands</CardTitle>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push('/brand/brand-add')}
                    >
                      <IconifyIcon icon="bx:plus" className="me-1" />
                      Add Brand
                    </Button>
                  </div>
                </CardHeader>

                <div className="table-responsive">
                  <table className="table table-hover table-centered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th
                          className="p-3"
                          onClick={() => toggleSort('name')}
                          style={{ cursor: 'pointer', width: '30%' }}
                        >
                          <div className="d-flex align-items-center">
                            <span>Brand Name</span>
                            {sortField === 'name' && (
                              <IconifyIcon
                                icon={
                                  sortOrder === 'asc'
                                    ? 'bx:sort-up'
                                    : 'bx:sort-down'
                                }
                                className="ms-2 text-primary"
                              />
                            )}
                          </div>
                        </th>
                        <th className="p-3" style={{ width: '20%' }}>Brand Code</th>
                        <th className="p-3" style={{ width: '30%' }}>Description</th>
                        <th className="p-3" style={{ width: '10%' }}>Status</th>
                        <th className="p-3" style={{ width: '10%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((brand) => (
                          <tr key={brand.id}>
                            <td className="p-3">{brand.name || brand.brandName || '—'}</td>
                            <td className="p-3">{brand.brandCode || '—'}</td>
                            <td className="p-3">
                              {brand.brandDescription ? (
                                <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                  {brand.brandDescription}
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`badge badge-soft-${brand.isActive ? 'success' : 'danger'} rounded-pill me-1`}>
                                {brand.isActive ? 'Aktif' : 'Pasif'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="d-flex gap-2">
                                <Button
                                  variant="soft-primary"
                                  size="sm"
                                  onClick={() => router.push(`/brand/brand-edit?uuid=${brand.uuid}`)}
                                >
                                  <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                                </Button>
                                <Button
                                  variant="soft-danger"
                                  size="sm"
                                  onClick={() => handleDelete(brand.uuid)}
                                >
                                  <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            Brand bulunamadı
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                  <div className="text-muted">
                    Toplam <strong>{pagination.totalElements}</strong> kayıt, Sayfa <strong>{page}</strong> / <strong>{totalPages || 1}</strong>
                  </div>
                  <nav aria-label="Page navigation">
                    <Pagination className="mb-0">
                      <Pagination.Prev 
                        disabled={page === 1}
                        onClick={() => page > 1 && setPage((p) => p - 1)}
                        style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                      />
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === page}
                            onClick={() => setPage(pageNum)}
                            style={{ cursor: 'pointer' }}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      })}
                      <Pagination.Next 
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => page < totalPages && setPage((p) => p + 1)}
                        style={{ cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
                      />
                    </Pagination>
                  </nav>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      <BrandFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onFilter={handleFilterChange}
      />
    </>
  );
};

export default BrandList;
