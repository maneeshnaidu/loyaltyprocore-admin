import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface DataTableColumnFilterProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>
    title: string
}

export function DataTableColumnFilter<TData>({
    table,
    title,
}: DataTableColumnFilterProps<TData>) {
    return (
        <Input
            placeholder="Filter emails..."
            value={(table.getColumn(title)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(title)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
        />
    )
}

