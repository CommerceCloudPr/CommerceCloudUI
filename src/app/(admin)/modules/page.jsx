
'use client'
import { useEffect, useState } from "react";
import Table from "../../../components/table";

const ModulesPage = async () => {
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            label: 'Id',
            value: 'uuid'
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
            label: 'Name',
            value: 'name'
        },
        {
            label: 'Key',
            value: 'key'
        }
    ]
    const session = (localStorage.getItem('session_token'))
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('http://api-dev.aykutcandan.com/user/module/get-all',
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



    return <div>
        {
            loading === true && <Table columns={columns} data={data} />
        }
    </div>


}

export default ModulesPage
