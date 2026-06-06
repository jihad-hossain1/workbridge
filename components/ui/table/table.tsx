"use client";

import React, { createContext } from "react";
import { clsx } from "clsx";
import { DropdownMenu } from "../dropdown/DropdownMenu";
import { Ellipsis } from "lucide-react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

interface TableContextValue {
  isHeader?: boolean;
}

const TableContext = createContext<TableContextValue>({});

export const Table = ({ children, className, ...props }: TableProps) => {
  return (
    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table
          className={clsx("w-full text-sm text-left text-slate-600 dark:text-slate-300", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
  return (
    <TableContext.Provider value={{ isHeader: true }}>
      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-xs font-semibold tracking-wider">
        {children}
      </thead>
    </TableContext.Provider>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">{children}</tbody>
  );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow = ({ children, className, ...props }: TableRowProps) => {
  return (
    <tr
      className={clsx("transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50", className)}
      {...props}
    >
      {children}
    </tr>
  );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell = ({
  children,
  className,
  ...props
}: TableCellProps) => {
  const { isHeader } = React.useContext(TableContext);
  const Component = isHeader ? "th" : "td";

  return (
    <Component
      {...props}
      className={clsx(
        "px-4 py-3 align-middle whitespace-nowrap",
        isHeader ? "font-semibold" : "",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export const TableActionsMenu = ({
  menus,
  isLastItem,
}: {
  menus: any;
  isLastItem?: boolean;
}) => {
  return (
    <div>
      <DropdownMenu
        trigger={
          <button className="flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <Ellipsis className="h-4 w-4" />
          </button>
        }
        items={menus}
        openUpwards={isLastItem}
      />
    </div>
  );
};

Table.DisplayName = "Table";
TableHeader.DisplayName = "TableHeader";
TableBody.DisplayName = "TableBody";
TableRow.DisplayName = "TableRow";
TableCell.DisplayName = "TableCell";
TableActionsMenu.DisplayName = "TableActionsMenu";

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.ActionsMenu = TableActionsMenu;
