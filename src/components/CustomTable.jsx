'use client'
import clsx from "clsx"
import { Button, FormCheck, Table } from "react-bootstrap"

const CustomTable = (props) => {


    return <div>
        <Table hover align="center">
            <thead className="table-light">
                <tr>
                    {
                        props.columns.map((item, key) => {
                            return <th scope="col">{item.label}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {props.data.map((row, idx) => (
                    <tr key={row.uuid || idx}>
                        {props.columns.map((col, cIdx) => {
                            if (col.type === 'toggle') {
                                return <td><FormCheck type="switch" onChange={() => col.onClick(row, col)} id="switch4" checked={row[col.value] === 'ACTIVE' ? true : false} /></td>

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