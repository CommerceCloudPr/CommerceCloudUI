
'use client'
import { useEffect, useState } from "react";
import PageTItle from '@/components/PageTItle';
import Table from "../../../components/table";

const AddressPage = async () => {
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            label: 'Id',
            value: 'uuid'
        },
        {
            label: 'Address Type',
            value: 'addressType'
        },
        {
            label: 'Address 1',
            value: 'addressLine1'
        },
        {
            label: 'Address 2',
            value: 'addressLine2'
        },
        {
            label: 'City',
            value: 'city'
        },
        {
            label: 'Company',
            value: 'companyName'
        },
        {
            label: 'Phone',
            value: 'phoneNumber'
        },
        {
            label: 'Fax No',
            value: 'taxNumber'
        },
        {
            label: 'Fax Office',
            value: 'taxOffice'
        },
        {
            label: 'Create Date',
            value: 'createdAt'
        },
        {
            label: 'Update Date',
            value: 'updatedAt'
        }
    ]
    const session = (localStorage.getItem('session_token'))
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('http://api-dev.aykutcandan.com/user/address/get-all',
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            }
        )
            .then((res) => res.json())
            .then((res) => {
                console.log(res.data)
                setData(res.data)
                setLoading(true)
            })
            .catch((err) => console.log(err))
    }, [])



    return <>
        <PageTItle title="PERMISSIONS" />
        {
            loading === true && <Table columns={columns} data={data} />
        }
    </>


}

export default AddressPage
