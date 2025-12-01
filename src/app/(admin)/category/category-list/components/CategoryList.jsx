'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Card, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageTItle from '@/components/PageTItle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner';
import { fetchCategories } from '@/utils/categoryApi';
import CategoryFilter from './CategoryFilter';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const CategoryList = () => {
  const router = useRouter();

  const [originalData, setOriginalData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({});

  const toggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Root kategorileri bul (parent olmayan)
  const rootCategories = useMemo(() => {
    const seen = new Set(originalData.map((c) => c.uuid));
    // Çocuk kategorileri root'tan çıkar
    originalData.forEach((cat) =>
      cat.childCategories?.forEach((child) => seen.delete(child.uuid))
    );
    return originalData.filter((cat) => seen.has(cat.uuid));
  }, [originalData]);

  // Sıralama
  const sortedData = useMemo(() => {
    return [...rootCategories].sort((a, b) => {
      const v1 = a[sortField]?.toLowerCase() || '';
      const v2 = b[sortField]?.toLowerCase() || '';
      if (v1 < v2) return sortOrder === 'asc' ? -1 : 1;
      if (v1 > v2) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, rootCategories]);

  // Sayfalama
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Tree yapısında row render
  const renderRow = (row, level = 0) => {
    const hasChildren = row.childCategories?.length > 0;

    return (
      <React.Fragment key={row.uuid}>
        <tr>
          <td
            className="p-3"
            style={{
              paddingLeft: `${level * 30 + 15}px`,
            }}
          >
            <div className="d-flex align-items-center">
              {hasChildren ? (
                <span
                  onClick={() => toggle(row.uuid)}
                  style={{ cursor: 'pointer', marginRight: '8px', fontSize: '14px' }}
                >
                  {open[row.uuid] ? '▼' : '►'}
                </span>
              ) : (
                <span style={{ marginRight: '22px' }}></span>
              )}
              <span>{row.name}</span>
            </div>
          </td>
          <td className="p-3">{row.description || '—'}</td>
          <td className="p-3">
            <span
              className={`badge badge-soft-${row.isActive ? 'success' : 'danger'} rounded-pill text-${row.isActive ? 'success' : 'danger'} fw-semibold`}
            >
              {row.isActive ? 'Aktif' : 'Pasif'}
            </span>
          </td>
          <td className="p-3">
            <div className="d-flex gap-2">
              <Button
                variant="soft-info"
                size="sm"
                onClick={() => router.push(`/category/${row.uuid}/detail`)}
              >
                <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
              </Button>
              <Button
                variant="soft-primary"
                size="sm"
                onClick={() => router.push(`/category/category-edit?id=${row.uuid}`)}
              >
                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
              </Button>
              <Button
                variant="soft-danger"
                size="sm"
                onClick={() => console.log('Delete category:', row.uuid)}
              >
                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
              </Button>
            </div>
          </td>
        </tr>

        {open[row.uuid] &&
          row.childCategories?.map((child) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  const fetchCategoriesData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 0,
        size: 1000, // Tüm kategorileri al (tree yapısı için)
        sortBy: 'createdAt',
        sortDirection: 'ASC',
        paginated: false, // Tree yapısı için tüm veriyi al
        ...filters,
      };

      const res = await fetchCategories(params);
      const items = Array.isArray(res.items) ? res.items : [];
      setOriginalData(items);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toastify({
        props: { type: 'error' },
        message: 'Kategoriler yüklenirken hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  return (
    <>
      <PageTItle title="CATEGORY LIST" />
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
              onClick={() => router.push('/category/category-add')}
            >
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Category
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
                  <CardTitle as={'h4'}>Categories Tree</CardTitle>
                </CardHeader>

                <div className="table-responsive">
                  <table className="table table-hover table-centered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th
                          className="p-3"
                          onClick={() => toggleSort('name')}
                          style={{ cursor: 'pointer', width: '35%' }}
                        >
                          <div className="d-flex align-items-center">
                            <span>Kategori Adı</span>
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
                        <th className="p-3" style={{ width: '35%' }}>Açıklama</th>
                        <th className="p-3" style={{ width: '15%' }}>Durum</th>
                        <th className="p-3" style={{ width: '15%' }}>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((cat) => renderRow(cat))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            Kategori bulunamadı
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3">
                  <div className="text-muted">
                    Toplam {sortedData.length} kayıt, Sayfa {page} / {totalPages || 1}
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

      <CategoryFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onFilter={handleFilterChange}
      />
    </>
  );
};

export default CategoryList;
