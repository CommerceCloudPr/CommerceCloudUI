'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Card, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageTItle from '@/components/PageTItle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner';
import { fetchAttributes, deleteAttribute } from '@/utils/attributeApi';
import AttributeFilter from './AttributeFilter';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const AttributesList = () => {
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

  const fetchAttributesData = useCallback(async () => {
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

      const res = await fetchAttributes(params);
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
      console.error('Error fetching attributes:', error);
      toastify({
        props: { type: 'error' },
        message: error.message || 'Attribute yüklenirken hata oluştu',
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
    if (!confirm('Bu attribute\'u silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await deleteAttribute(uuid);
      if (response.success) {
        toastify({
          props: { type: 'success' },
          message: response.message || 'Attribute başarıyla silindi',
        });
        fetchAttributesData();
      } else {
        toastify({
          props: { type: 'error' },
          message: response.message || 'Attribute silinirken hata oluştu',
        });
      }
    } catch (error) {
      console.error('Error deleting attribute:', error);
      toastify({
        props: { type: 'error' },
        message: error.message || 'Attribute silinirken hata oluştu',
      });
    }
  };

  useEffect(() => {
    fetchAttributesData();
  }, [fetchAttributesData]);

  return (
    <>
      <PageTItle title="ATTRIBUTE LIST" />
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

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowFilter(true)}
            >
              <IconifyIcon icon="bx:filter-alt" className="me-1" />
              Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/attributes/attributes-add')}
            >
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Attribute
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
                  <CardTitle as={'h4'}>All Attributes</CardTitle>
                </CardHeader>

                <div className="table-responsive">
                  <table className="table table-hover table-centered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th
                          className="p-3"
                          onClick={() => toggleSort('name')}
                          style={{ cursor: 'pointer', width: '40%' }}
                        >
                          <div className="d-flex align-items-center">
                            <span>Attribute Name</span>
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
                        <th
                          className="p-3"
                          onClick={() => toggleSort('type')}
                          style={{ cursor: 'pointer', width: '30%' }}
                        >
                          <div className="d-flex align-items-center">
                            <span>Attribute Type</span>
                            {sortField === 'type' && (
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
                        <th className="p-3" style={{ width: '15%' }}>Created Date</th>
                        <th className="p-3" style={{ width: '15%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((attr) => (
                          <tr key={attr.id}>
                            <td className="p-3">{attr.name || '—'}</td>
                            <td className="p-3">
                              <span className="badge badge-soft-primary rounded-pill">
                                {attr.type || '—'}
                              </span>
                            </td>
                            <td className="p-3">
                              {attr.createDate
                                ? new Date(attr.createDate).toLocaleDateString('tr-TR')
                                : '—'}
                            </td>
                            <td className="p-3">
                              <div className="d-flex gap-2">
                                <Button
                                  variant="soft-primary"
                                  size="sm"
                                  onClick={() => router.push(`/attributes/attributes-edit?id=${attr.id}`)}
                                >
                                  <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                                </Button>
                                <Button
                                  variant="soft-danger"
                                  size="sm"
                                  onClick={() => handleDelete(attr.id)}
                                >
                                  <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            Attribute bulunamadı
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3">
                  <div className="text-muted">
                    Toplam {pagination.totalElements} kayıt, Sayfa {page} / {totalPages || 1}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <IconifyIcon icon="bx:chevron-left" />
                      Prev
                    </Button>

                    <span className="fw-bold px-3 d-flex align-items-center">
                      {page} / {totalPages || 1}
                    </span>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                      <IconifyIcon icon="bx:chevron-right" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      <AttributeFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onFilter={handleFilterChange}
      />
    </>
  );
};

export default AttributesList;
