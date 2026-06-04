import { Table } from "./table";

export const DataTableError = ({ cellLength = 5 }: { cellLength?: number }) => {
  return (
    <Table.Body>
      <Table.Row className="col-span-full">
        <Table.Cell colSpan={cellLength}>
          <div className="p-4 text-center">
            <h4 className="mb-2 text-lg font-semibold text-gray-600">
              Something went wrong
            </h4>
            <p className="text-gray-500">There was an error fetching data</p>
          </div>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

DataTableError.displayName = "DataTableError";
