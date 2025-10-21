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
import { fetchProducts } from '@/utils/productApi';
import ProductFilter from './ProductFilter';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const ProductList = () => {
  const router = useRouter();

  // tablo verisi (CustomTable’ın beklediği alan adlarına map’lenmiş)
  const [data, setData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

  // kolonlar (memo ile yeniden yaratımı azalt)
  const columns = useMemo(
    () => [
      {
        label: '',
        value: 'checkbox',
        type: 'checkbox',
        sortable: false,
        selectedItems: selectedProducts,
        onChange: (row, checked) => {
          setSelectedProducts((prev) =>
            checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
          );
        },
        onSelectAll: (checked) => {
          setSelectedProducts(checked ? data.map((item) => item.id) : []);
        },
      },
      { label: 'Product Name & Size', value: 'title', type: 'product' },
      { label: 'Price', value: 'price', type: 'price' },
      { label: 'Stock', value: 'stock', type: 'stock', sortable: false },
      { label: 'Category', value: 'category', type: 'text' },
      { label: 'Rating', value: 'rating', type: 'rating', sortable: false },
      {
        label: 'Action',
        value: 'actions',
        type: 'product-actions',
        sortable: false,
        onView: (row) => router.push(`/products/${row.id}/detail`),
        onEdit: (row) => router.push(`/products/product-add?id=${row.id}`),
        onDelete: (row) => {
          // TODO: delete endpoint
          console.log('Delete product:', row.id);
        },
      },
    ],
    [selectedProducts, data, router]
  );

  const mapToRow = (p) => ({
    id: p.id,
    title: p.name || p.sku || '—',
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
    size: '',
    price: p.effectivePrice ?? p.sellPrice ?? p.originalPrice ?? 0,
    stock: {
      left: p.totalStock ?? 0,
      sold: undefined, // backend'de yok; stok bileşeni sold'u opsiyonel kullanmalı
    },
    category: '', // backend şemanda yok; varsa burada doldur
    rating: { star: 0, review: 0 }, // şemada yok; rating bileşeni opsiyonel çalışmalı
    raw: p, // ihtiyaç olursa orijinal ürün
  });

  const fetchProductsData = useCallback(async () => {
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

      const res = await fetchProducts(params);

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

      setSelectedProducts([]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toastify({ props: { type: 'error' }, message: 'Ürünler yüklenirken hata oluştu' });
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
    fetchProductsData();
  }, [fetchProductsData]);

  return (
    <>
      <PageTItle title="PRODUCT LIST" />
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
              onClick={() => router.push('/products/product-add')}
            >
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Product
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
              // Eğer tablo kolon başlığına tıklayarak sıralama destekliyorsa:
              // onSort={handleSortChange}
              // sortBy={sortConfig.sortBy}
              // sortDirection={sortConfig.sortDirection}
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

      <ProductFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onFilter={handleFilterChange}
      />
    </>
  );
};

export default ProductList;