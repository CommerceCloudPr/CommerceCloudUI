'use client'
import PageTitle from '@/components/PageTItle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAttributes } from '../../../../utils/attributeApi';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import { Button, Spinner } from 'react-bootstrap';
import CustomTable from '../../../../components/CustomTable';
import IconifyIcon from '../../../../components/wrappers/IconifyIcon';

const toastify = ({ props, message }) =>
    toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const VariantList = () => {
    const session = localStorage.getItem('session_token');
    const [data, setData] = useState([]);
    const router = useRouter();
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
    });
    const [selectedAttribute, setSelectedAttribute] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'createdAt',
        sortDirection: 'ASC',
    });
    const columns = useMemo(
        () => [
            { label: 'Attribute Name', value: 'name', type: 'attributeName' },
            { label: 'Attribute Type', value: 'type', type: 'attributeType' },
            { label: 'Create Date', value: 'createDate', type: 'createdAt' },
            { label: 'Update Date', value: 'updateDate', type: 'updatedAt' },
            {
                label: 'Action',
                value: 'actions',
                type: 'attribute-actions',
                sortable: false,
                onEdit: (row) => router.push(`/attribute/attribute-add?id=${row.id}`),
                onDelete: (row) => handleDeleteAttribute(row.id)

            },
        ],
        [selectedAttribute, data, router]
    );

    const handleDeleteAttribute = (id) => {
        fetch('https://api-dev.aykutcandan.com/product/attributes-definitions/delete/' + id, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${decodeURIComponent(session)}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((res) => {
                toastify({ props: { type: 'success' }, message: 'Attribute başarılı şekilde silindi' });
                fetchAttributeData()
            })
            .catch((err) => toastify({ props: { type: 'error' }, message: 'Attribute yüklenirken hata oluştu' }))
            .finally(() => setLoading(false))
    }

    const fetchAttributeData = useCallback(async () => {
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

            const res = await fetchAttributes(params);

            const items = Array.isArray(res.items) ? res.items : [];
            console.log(items)
            const rows = items;
            setData(rows);

            setPagination((prev) => ({
                ...prev,
                currentPage: res.page ?? prev.currentPage,
                pageSize: res.size ?? prev.pageSize,
                totalPages: res.totalPages ?? 0,
                totalElements: res.totalElements ?? rows.length,
            }));

            setSelectedAttribute([]);
        } catch (error) {
            console.error('Error fetching attributes:', error);
            toastify({ props: { type: 'error' }, message: 'Attribute yüklenirken hata oluştu' });
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
        fetchAttributeData();
    }, [fetchAttributeData]);

    return <>
        <PageTitle title='Variant List'>

        </PageTitle>
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
                        onClick={() => router.push('/attribute/attribute-add')}
                    >
                        <IconifyIcon icon="bx:plus" className="me-1" />
                        Add Attribute
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

    </>
}

export default VariantList;