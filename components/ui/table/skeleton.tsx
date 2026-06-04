import { Table } from "./table";

export const DataTableSkeleton = ({ cellLength = 8 }) => {
    return (
        <>
            <Table.Body>
                {Array.from({ length: 10 }).map((_, index) => (
                    <Table.Row key={index}>
                        {Array.from({ length: cellLength }).map((_, index) => (
                            <Table.Cell key={index}>
                                <div className='h-4 w-24 animate-pulse bg-slate-200 rounded-md' />
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </>
    );
};

DataTableSkeleton.displayName = "DataTableSkeleton";



