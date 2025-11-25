'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import CustomTable from '../../../../../components/CustomTable';
import Pagination from '../../../../../components/Pagination';
import { Button } from 'react-bootstrap';
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

  const [data, setData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // server-side pagination & sort
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    sortDirection: 'ASC',
  });

  // kolonlar
  const columns = useMemo(
    () => [
      {
        label: '',
        value: 'checkbox',
        type: 'checkbox',
        sortable: false,
        selectedItems: selectedCategories,
        onChange: (row, checked) => {
          setSelectedCategories((prev) =>
            checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
          );
        },
        onSelectAll: (checked) => {
          setSelectedCategories(checked ? data.map((item) => item.id) : []);
        },
      },
      { label: 'Kategori Adı', value: 'name', type: 'text' },
      { label: 'Açıklama', value: 'description', type: 'text' },
      { label: 'Alt Kategoriler', value: 'childCount', type: 'text', sortable: false },
      { 
        label: 'Durum', 
        value: 'status', 
        type: 'badge',
        sortable: false,
        getBadgeVariant: (row) => row.isActive ? 'success' : 'danger',
        getBadgeText: (row) => row.isActive ? 'Aktif' : 'Pasif',
      },
      {
        label: 'İşlemler',
        value: 'actions',
        type: 'category-actions',
        sortable: false,
        onView: (row) => router.push(`/category/${row.id}/detail`),
        onEdit: (row) => router.push(`/category/category-edit?id=${row.id}`),
        onDelete: (row) => {
          // TODO: delete endpoint
          console.log('Delete category:', row.id);
        },
      },
    ],
    [selectedCategories, data, router]
  );

  const mapToRow = (c) => ({
    id: c.id,
    uuid: c.uuid,
    name: c.name || '—',
    description: c.description || '—',
    childCount: Array.isArray(c.childCategories) ? c.childCategories.length : 0,
    isActive: c.isActive,
    status: c.isActive ? 'Aktif' : 'Pasif',
    raw: c,
  });

  const fetchCategoriesData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        sortBy: sortConfig.sortBy,
        sortDirection: sortConfig.sortDirection,
        paginated: true,
        ...filters,
      };

      const res = await fetchCategories(params);

      const items = Array.isArray(res.items) ? res.items : [];
      const rows = items.map(mapToRow);
      setData(rows);

      setPagination((prev) => ({
        ...prev,
        currentPage: res.page ?? prev.currentPage,
        pageSize: res.size ?? prev.pageSize,
        totalPages: res.totalPages ?? 0,
        totalElements: res.totalElements ?? rows.length,
      }));

      setSelectedCategories([]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toastify({ props: { type: 'error' }, message: 'Kategoriler yüklenirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, sortConfig, filters]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 0 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 0 }));
  };

  const handleSortChange = (sortBy, sortDirection) => {
    setSortConfig({ sortBy, sortDirection });
    setPagination((prev) => ({ ...prev, currentPage: 0 }));
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
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
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
            <Button variant="outline-secondary" size="sm" onClick={() => setShowFilter(true)}>
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
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <Spinner />
          </div>
        ) : (
          <>
            <CustomTable
              data={data}
              columns={columns}
              pagination={pagination}
            />

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalElements={pagination.totalElements}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
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
