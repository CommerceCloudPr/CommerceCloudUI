'use client'
import { useEffect, useState, useCallback } from 'react';
import CustomTable from '../../../../components/CustomTable'
import Pagination from '../../../../components/Pagination'
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import UserFilter from '../components/UserFilter';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageTItle from '@/components/PageTItle';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner';
import { fetchUsers } from '@/utils/userApi';
const toastify = ({
    props,
    message
}) => {
    toast(message, {
        ...props,
        hideProgressBar: true,
        theme: 'colored',
        icon: false
    });
};

const UserList = () => {
    const [data, setData] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
    });
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'createdAt',
        sortDirection: 'ASC'
    });
    const router = useRouter();
    const columns = [
        {
            label: 'First Name',
            value: 'firstName',
            type: 'text'
        },
        {
            label: 'Last Name',
            value: 'lastName',
            type: 'text'

        },
        {
            label: 'Email',
            value: 'email',
            type: 'text'

        },
        {
            label: 'Username',
            value: 'username',
            type: 'text'

        },
        {
            label: 'Role',
            value: 'role',
            type: 'badge'

        },
        {
            label: 'Create Date',
            value: 'createdAt',
            type: 'text'

        },
        {
            label: 'Modify Date',
            value: 'updatedAt',
            type: 'text'

        },
        {
            label: 'E-Posta / SMS',
            value: 'permissions',
            type: 'permissions',
            sortable: false

        },
        {
            label: 'Status',
            value: 'status',
            type: 'toggle',
            sortable: false,
            onClick: (row, col) => {
                console.log(row, col)
            }
        },
        {
            label: 'Actions',
            value: 'actions',
            type: 'actions',
            sortable: false,
            onClick: (row, col) => {
                router.push(`/user/edit/${row.uuid}`)
            }
        }
    ]
    const fetchUsersData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.currentPage,
                size: pagination.pageSize,
                sortBy: sortConfig.sortBy,
                sortDirection: sortConfig.sortDirection,
                paginated: true,
                ...filters
            };

            const response = await fetchUsers(params);
            
            if (response && response.data) {
                // API response structure: res.data.content for paginated data
                const userData = response.data.content || [];
                setData(Array.isArray(userData) ? userData : []);
                
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.totalPages || 0,
                    totalElements: response.data.totalElements || 0
                }));
            } else {
                toastify({
                    props: { type: 'error' },
                    message: 'Kullanıcılar yüklenirken hata oluştu'
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toastify({
                props: { type: 'error' },
                message: 'Kullanıcılar yüklenirken hata oluştu'
            });
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.pageSize, sortConfig, filters]);

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePageSizeChange = (size) => {
        setPagination(prev => ({ ...prev, pageSize: size, currentPage: 0 }));
    };

    const handleFilterChange = (newFilters) => {
        console.log('Filter callback received:', newFilters);
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, currentPage: 0 })); // Reset to first page
    };

    const handleSortChange = (sortBy, sortDirection) => {
        setSortConfig({ sortBy, sortDirection });
        setPagination(prev => ({ ...prev, currentPage: 0 })); // Reset to first page
    };

    useEffect(() => {
        fetchUsersData();
    }, [fetchUsersData])


    return (
        <>
            <PageTItle title="USER LIST" />
            <div className='d-flex flex-column gap-4 justify-content-start'>
                <div className='d-flex justify-content-between w-100 align-items-center'>
                    {/* Page Size Selector - 5, 10, 25, 50 = kaldırabilirim konuşalım*/}
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
                            onClick={() => router.push('/user/create')}
                        >
                            <IconifyIcon icon="bx:plus" className="me-1" />
                            Create
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
                            onSort={handleSortChange}
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

            <UserFilter
                show={showFilter}
                onHide={() => setShowFilter(false)}
                onFilter={handleFilterChange}
            />
        </>
    );
}

export default UserList;