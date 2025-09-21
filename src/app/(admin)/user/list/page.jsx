'use client'
import { useEffect, useState } from 'react';
import CustomTable from '../../../../components/CustomTable'
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import UserFilter from '../components/UserFilter';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageTItle from '@/components/PageTItle';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
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
    const session = localStorage.getItem('session_token');
    const [data, setData] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const [loading, setLoading] = useState(false);
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
            label: '',
            value: 'info',
            type: 'edit',
            onClick: (row, col) => {
                router.push(`/user/create?uuid=${row?.uuid}` )
            }
        },
        {
            label: 'Status',
            value: 'status',
            type: 'toggle',
            onClick: (row, col) => {
                console.log(row, col)
            }
        }
    ]
    useEffect(() => {
        fetch('http://api-dev.aykutcandan.com/user/info/get-all',
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            }
        )
            .then((res) => res.json())
            .then((res) => {
                setData(res.data);
                setLoading(true);
                if (res.statusCode !== 200) {
                    toastify({
                        message: res.message,
                        props: {
                            type: 'error',
                            position: 'top-right',
                            closeButton: false,
                            autoClose: 3000
                        }
                    })
                }
            })
            .catch((err) => {
                toastify({
                    message: err?.message,
                    props: {
                        type: 'error',
                        position: 'top-right',
                        closeButton: false,
                        autoClose: 3000
                    }
                })
            })
    }, [])


    return loading === false ? <Spinner /> : <>
        <PageTItle title="USER LIST" />
        <div className='d-flex flex-column gap-5 justify-content-start'>
            <div className='d-flex justify-content-end w-100 gap-2'>
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
            <CustomTable
                data={data}
                columns={columns}
            />
        </div>

        <UserFilter
            show={showFilter}
            onHide={() => setShowFilter(false)}
        />
    </>


}

export default UserList;