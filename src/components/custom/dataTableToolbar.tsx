import { BaseType } from '@/types/commonTypes';
import { Table } from '@tanstack/react-table';
import React from 'react';
interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    bulkActionsHeader?: React.ComponentType<{ table: Table<TData> }>;
    children?: React.ReactNode;
}
export function DataTableToolbar<TData>({
    table,
    bulkActionsHeader: BulkActionsHeader,
    children
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between">
            {/* Left side - custom children */}
            <div>{children}</div>
            {/* Right side - bulk actions */}
            {BulkActionsHeader && <BulkActionsHeader table={table} />}
        </div>
    );
}