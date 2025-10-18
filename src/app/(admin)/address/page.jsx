
'use client'
import { useEffect, useState } from "react";
import PageTItle from '@/components/PageTItle';
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomTable from "../../../components/CustomTable";
import { toast } from "react-toastify";

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

const AddressPage = async () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
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
        },
        {
            label: '',
            value: 'actions',
            type: 'actions',
            sortable: false,
            onClick: (row, col) => {
                router.push(`/address/create?uuid=${row.uuid}`)
            }
        },
        {
            label: '',
            value: 'delete',
            type: 'delete',
            sortable: false,
            onClick: (row, col) => {
                setLoading(false)
                handleDeleteAddress(row.uuid)
            }
        }
    ]

    const handleDeleteAddress = (id) => {
        fetch('https://api-dev.aykutcandan.com/user/address/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${decodeURIComponent(session)}`
            }
        })
            .then((res) => res.json())
            .then((res) => {
                toastify({
                    message: res?.message,
                    props: {
                        type: res?.success === true ? 'success' : 'error',
                        position: 'top-right',
                        closeButton: false,
                        autoClose: 3000
                    }
                })
                setLoading(true)
                getDataFromApi()
            })
            .catch((err) => console.log(err))
    }

    const session = (localStorage.getItem('session_token'))
    const [data, setData] = useState([])

    const getDataFromApi = () => {
        fetch('https://api-dev.aykutcandan.com/user/address/get-all/me',
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
    }

    useEffect(() => {
        getDataFromApi()
    }, [])



    return <>
        <PageTItle title="ADDRESS LIST" />
        {
            loading === true && <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-end">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/address/create')}
                    >
                        <IconifyIcon icon="bx:plus" className="me-1" />
                        Create
                    </Button>
                </div>
                <CustomTable columns={columns} data={data} />

            </div>
        }
    </>


}

export default AddressPage
