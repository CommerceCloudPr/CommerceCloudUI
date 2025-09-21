'use client'
import clsx from "clsx"
import { Button, FormCheck, Table } from "react-bootstrap"

const CustomTable = (props) => {


    return <div>
        <Table hover align="center">
            <thead className="table-light">
                <tr>
                    {
                        props.columns?.map((item, key) => {
                            return <th key={key} scope="col">{item?.label}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {props.data?.map((row, idx) => (
                    <tr key={row?.uuid || idx}>
                        {props.columns?.map((col, cIdx) => {
                            if (col.type === 'toggle') {
                                return <td><FormCheck type="switch" onChange={() => col.onClick(row, col)} id="switch4" checked={row[col?.value] === 'ACTIVE' ? true : false} /></td>

                            } else if (col.type === 'edit') {
                                return <td onClick={() => col.onClick(row, col)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ff6600" fill-rule="evenodd" d="M3.25 22a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75" clip-rule="evenodd" /><path fill="#ff6600" d="m11.52 14.929l5.917-5.917a8.2 8.2 0 0 1-2.661-1.787a8.2 8.2 0 0 1-1.788-2.662L7.07 10.48c-.462.462-.693.692-.891.947a5.2 5.2 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-1.088 3.267a.848.848 0 0 0 1.073 1.073l3.266-1.088c.62-.207.93-.31 1.221-.45q.518-.246.969-.598c.255-.199.485-.43.947-.891m7.56-7.559a3.146 3.146 0 0 0-4.45-4.449l-.71.71l.031.09c.26.749.751 1.732 1.674 2.655A7 7 0 0 0 18.37 8.08z" /></svg>
                                </td>
                            } else {
                                return <td key={cIdx}>{row[col?.value]}</td>
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