'use client'
import { useEffect } from 'react';
import ComponentContainerCard from './ComponentContainerCard';
import { Grid } from 'gridjs-react'
const Table = (props) => {

    return <div>
        <ComponentContainerCard id="loading_state">
            <div className="pt-3">
                <Grid
                    columns={props?.columns?.map((item) => item.label)}
                    sort={true}
                    search={true}
                    pagination={{ limit: 5 }}
                    data={() => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                resolve(
                                    props?.data?.map(row =>
                                        props?.columns?.map(col => row[col.value])
                                    )
                                )
                            }, 2000);
                        });
                    }}
                />
            </div>
        </ComponentContainerCard>
    </div>

}

export default Table;