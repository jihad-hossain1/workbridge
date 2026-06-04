import { Table } from "./table";

export const NoDataFound = ({ cellLength = 5 }: { cellLength?: number }) => {
  return (
    <Table.Body>
      <Table.Row className="col-span-full">
        <Table.Cell colSpan={cellLength}>
          <div className="p-4 text-center">
            <h4 className="mb-2 text-lg font-semibold text-gray-600">
              No data found
            </h4>
            <p className="text-gray-500">There are no data in this table</p>
          </div>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

NoDataFound.displayName = "NoDataFound";
