
'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import PageTItle from '@/components/PageTItle';
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomTable from "../../../../components/CustomTable";
import ApiClient from "../../../../utils/apiClient";
import { fetchBrand } from "../../../../utils/brandApi";
import Pagination from "../../../../components/Pagination";
import Spinner from "@/components/Spinner";

const toastify = ({ props, message }) =>
    toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const BrandList = () => {

    const [loading, setLoading] = useState(true);
    const router = useRouter()
    const [data, setData] = useState([])
    const [selectedBrands, setSelectedBrands] = useState([]);
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

    const columns = useMemo(
        () => [
            {
                label: 'Id',
                value: 'id'
            },
            {
                label: 'Name',
                value: 'name'
            },
            {
                label: 'Description',
                value: 'brandDescription'
            },
            {
                label: 'Action',
                value: 'actions',
                type: 'product-actions',
                sortable: false,
                onView: (row) => router.push(`/brand/${row.id}/detail`),
                onEdit: (row) => router.push(`/brand/brand-add?uuid=${row.id}`),
                onDelete: (row, col) => {
                    setLoading(false)
                    handleDeleteBrand(row.uuid)
                }
            },


        ],
        [selectedBrands, data, router]
    );

    const fetchBrandData = useCallback(async () => {
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

            const res = await fetchBrand(params);

            const items = Array.isArray(res.items) ? res.items : [];
            const rows = items;
            console.log(rows)
            setData(rows);

            setPagination((prev) => ({
                ...prev,
                currentPage: res.page ?? prev.currentPage,
                pageSize: res.size ?? prev.pageSize,
                totalPages: res.totalPages ?? 0,
                totalElements: res.totalElements ?? rows.length,
            }));

            setSelectedBrands([]);
        } catch (error) {
            console.error('Error fetching brands:', error);
            toastify({ props: { type: 'error' }, message: 'Markalar yüklenirken hata oluştu' });
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
        fetchBrandData();
    }, [fetchBrandData]);

    const handleDeleteBrand = async (id) => {
        const response = await ApiClient(`https://api-dev.aykutcandan.com/product/brand/delete/${id}`, 'DELETE')
        if (response) {
            setLoading(true)

        }
    }


    return <>
        <PageTItle title="BRAND LIST" />
        {
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

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => router.push('/brand/brand-add')}
                        >
                            <IconifyIcon icon="bx:plus" className="me-1" />
                            Add Brand
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



        }
    </>

}

export default BrandList