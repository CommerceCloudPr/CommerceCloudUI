'use client'
import clsx from "clsx"
import { Button, FormCheck, Table, Badge } from "react-bootstrap"
import IconifyIcon from "./wrappers/IconifyIcon"
import { useState, useMemo } from "react"

const CustomTable = (props) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return props.data

        return [...props.data].sort((a, b) => {
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
        })
    }, [props.data, sortConfig])

    const handleSort = (columnKey) => {
        let direction = 'asc'
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key: columnKey, direction })

        if (props.onSort) {
            props.onSort(columnKey, direction.toUpperCase())
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
                {sortedData.map((row, idx) => (
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
                            } else if (col.type === 'delete') {
                                return <td key={cIdx}>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => col.onClick(row, col)}
                                    >
                                        <IconifyIcon icon="bx:trash" />
                                    </Button>
                                </td>
                            }
                            else {
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