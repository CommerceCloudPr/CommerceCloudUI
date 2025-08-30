'use client'
import { useEffect, useState } from 'react';
import CustomTable from '../../../../components/CustomTable'
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const UserList = () => {
    const session = localStorage.getItem('session_token');
    const [data, setData] = useState([])
    const router = useRouter()
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
            .then((res) => setData(res.data))
            .catch((err) => console.log(err))
    }, [])

    return <div className='d-flex flex-column gap-5 justify-content-start'>
        <div className='d-flex justify-content-end w-100'>
            <Button variant="primary" size="sm" className="d-flex justify-content-end" onClick={() => router.push('/user/create')}>Create</Button>

        </div>
        <CustomTable
            data={data}
            columns={columns}
        />
    </div>


}

export default UserList;