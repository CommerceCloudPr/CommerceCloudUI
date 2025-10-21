'use client'
import { Button, FormCheck, Table, Badge } from "react-bootstrap"
import IconifyIcon from "./wrappers/IconifyIcon"
import { useState, useMemo } from "react"
import Image from "next/image"

const CustomTable = (props) => {
    const [localSortConfig, setLocalSortConfig] = useState({ key: null, direction: 'asc' })

    const isApiSorting = !!props.onSort
    
    const sortConfig = useMemo(() => {
        return isApiSorting 
            ? { key: props.sortBy, direction: props.sortDirection?.toLowerCase() || 'asc' }
            : localSortConfig
    }, [isApiSorting, props.sortBy, props.sortDirection, localSortConfig])


    const sortedAndPaginatedData = useMemo(() => {
        if (isApiSorting) {
            return props.data
        }

        let sortedData = props.data;

        // Sorting yap
        if (sortConfig.key) {
            sortedData = [...props.data].sort((a, b) => {
                const aValue = a[sortConfig.key]
                const bValue = b[sortConfig.key]

                if (aValue == null && bValue == null) return 0
                if (aValue == null) return 1
                if (bValue == null) return -1

                let comparison = 0
                
                const aDate = new Date(aValue)
                const bDate = new Date(bValue)
                const isADate = !isNaN(aDate.getTime()) && typeof aValue === 'string' && aValue.includes('-')
                const isBDate = !isNaN(bDate.getTime()) && typeof bValue === 'string' && bValue.includes('-')
                
                if (isADate && isBDate) {
                    comparison = aDate.getTime() - bDate.getTime()
                }
                else if (!isNaN(aValue) && !isNaN(bValue)) {
                    comparison = Number(aValue) - Number(bValue)
                }
                else {
                    comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase())
                }

                return sortConfig.direction === 'desc' ? -comparison : comparison
            });
        }

        // Client-side pagination yap (eğer pagination props'u varsa)
        if (props.pagination) {
            const { currentPage = 0, pageSize = 10 } = props.pagination;
            const startIndex = currentPage * pageSize;
            const endIndex = startIndex + pageSize;
            return sortedData.slice(startIndex, endIndex);
        }

        return sortedData;
    }, [props.data, sortConfig, isApiSorting, props.pagination])

    const handleSort = (columnKey) => {
        let direction = 'asc'
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        
        if (isApiSorting) {
            // API sorting varsa callback'i çağır
            props.onSort(columnKey, direction.toUpperCase())
        } else {
            setLocalSortConfig({ key: columnKey, direction })
        }
    }

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <IconifyIcon icon="bx:sort" className="ms-1 text-muted" />
        }
        return sortConfig.direction === 'asc'
            ? <IconifyIcon icon="bx:sort-up" className="ms-1 text-primary" />
            : <IconifyIcon icon="bx:sort-down" className="ms-1 text-primary" />
    }

    return <div className="table-responsive">
        <Table hover className="table-centered table-striped">
            <thead className="table-light">
                <tr>
                    {
                        props.columns.map((item, key) => {
                            const isSortable = item.sortable !== false // Default to sortable unless explicitly disabled
                            
                            // Special handling for checkbox column
                            if (item.type === 'checkbox') {
                                // Tüm veri için kontrol et (sadece mevcut sayfa değil)
                                const totalDataLength = props.data ? props.data.length : 0;
                                const allSelected = item.selectedItems && item.selectedItems.length === totalDataLength && totalDataLength > 0;
                                const someSelected = item.selectedItems && item.selectedItems.length > 0;
                                
                                return (
                                    <th key={key} scope="col" style={{width: 20}}>
                                        <div className="form-check ms-1">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input" 
                                                id="selectAll"
                                                checked={allSelected}
                                                ref={(input) => {
                                                    if (input) input.indeterminate = someSelected && !allSelected;
                                                }}
                                                onChange={(e) => item.onSelectAll && item.onSelectAll(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="selectAll" />
                                        </div>
                                    </th>
                                );
                            }
                            
                            return (
                                <th
                                    key={key}
                                    scope="col"
                                    className={isSortable ? "cursor-pointer user-select-none" : ""}
                                    onClick={isSortable ? () => handleSort(item.value) : undefined}
                                    style={isSortable ? { cursor: 'pointer' } : {}}
                                >
                                    <div className="d-flex align-items-center">
                                        {item.label}
                                        {isSortable && getSortIcon(item.value)}
                                    </div>
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {sortedAndPaginatedData.map((row, idx) => (
                    <tr key={row.uuid || idx}>
                        {props.columns.map((col, cIdx) => {
                            if (col.type === 'toggle') {
                                return <td key={cIdx}><FormCheck type="switch" onChange={() => col.onClick(row, col)} id={`switch-${idx}-${cIdx}`} checked={row[col.value] === 'ACTIVE' ? true : false} /></td>
                            } else if (col.type === 'badge') {
                                const roleStyles = {
                                    'Admin': { bg: 'success', text: 'text-success' },
                                    'Editor': { bg: 'info', text: 'text-info' },
                                    'Viewer': { bg: 'secondary', text: 'text-secondary' }
                                }
                                const style = roleStyles[row[col.value]] || { bg: 'secondary', text: 'text-secondary' }
                                return <td key={cIdx}>
                                    <span className={`badge badge-soft-${style.bg} rounded-pill ${style.text} fw-semibold`}>
                                        {row[col.value]}
                                    </span>
                                </td>
                            } else if (col.type === 'permissions') {
                                const emailPermission = row.emailPermission !== false ? 'Evet' : 'Hayır'
                                const smsPermission = row.smsPermission !== false ? 'Evet' : 'Hayır'

                                return <td key={cIdx}>
                                    <div className="d-flex align-items-center gap-1">
                                        <Badge bg={emailPermission === 'Evet' ? 'success' : 'danger'} className="me-1">
                                            {emailPermission}
                                        </Badge>
                                        <span>/</span>
                                        <Badge bg={smsPermission === 'Evet' ? 'success' : 'danger'} className="ms-1">
                                            {smsPermission}
                                        </Badge>
                                    </div>
                                </td>
                            } else if (col.type === 'actions') {
                                return <td key={cIdx}>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => col.onClick(row, col)}
                                    >
                                        <IconifyIcon icon="bx:edit" />
                                    </Button>
                                </td>
                            } else if (col.type === 'product') {
                                return <td key={cIdx}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                                            <Image 
                                                src={row.image || '/placeholder-product.png'} 
                                                alt="product" 
                                                width={40}
                                                height={40}
                                                className="avatar-md rounded" 
                                                style={{objectFit: 'cover'}} 
                                            />
                                        </div>
                                        <div>
                                            <div className="text-dark fw-medium fs-15">
                                                {row[col.value]}
                                            </div>
                                            <p className="text-muted mb-0 mt-1 fs-13">
                                                <span>Size: </span>
                                                {row.size || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            } else if (col.type === 'price') {
                                return <td key={cIdx}>
                                    <span className="fw-semibold text-dark">
                                        ${row[col.value]}.00
                                    </span>
                                </td>
                            } else if (col.type === 'stock') {
                                const stockLeft = row.stockLeft || 0;
                                const stockSold = row.stockSold || 0;
                                return <td key={cIdx}>
                                    <p className="mb-1 text-muted">
                                        <span className="text-dark fw-medium">{stockLeft} Item</span> Left
                                    </p>
                                    <p className="mb-0 text-muted">{stockSold} Sold</p>
                                </td>
                            } else if (col.type === 'rating') {
                                const rating = row.rating || { star: 0, review: 0 };
                                return <td key={cIdx}>
                                    <span className="badge p-1 bg-light text-dark fs-12 me-1">
                                        <IconifyIcon icon="bxs:star" className="align-text-top fs-14 text-warning me-1" />
                                        {rating.star}
                                    </span>
                                    {rating.review} Review
                                </td>
                            } else if (col.type === 'product-actions') {
                                return <td key={cIdx}>
                                    <div className="d-flex gap-2">
                                        <Button variant="soft-info" size="sm" onClick={() => col.onView && col.onView(row)}>
                                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                                        </Button>
                                        <Button variant="soft-primary" size="sm" onClick={() => col.onEdit && col.onEdit(row)}>
                                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                                        </Button>
                                        <Button variant="soft-danger" size="sm" onClick={() => col.onDelete && col.onDelete(row)}>
                                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                                        </Button>
                                    </div>
                                </td>
                            } else if (col.type === 'checkbox') {
                                const isChecked = col.selectedItems && col.selectedItems.includes(row.id || row.uuid);
                                return <td key={cIdx} style={{width: 20}}>
                                    <div className="form-check ms-1">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input" 
                                            id={`check-${row.id || row.uuid || idx}`}
                                            checked={isChecked}
                                            onChange={(e) => col.onChange && col.onChange(row, e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor={`check-${row.id || row.uuid || idx}`} />
                                    </div>
                                </td>
                            } else {
                                return <td key={cIdx}>{row[col.value]}</td>
                            }
                        }
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
}

export default CustomTable;