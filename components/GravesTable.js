"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("last_name", { header: "Прізвище" }),
  columnHelper.accessor("first_name", { header: "Ім'я" }),
  columnHelper.accessor("middle_name", { header: "По батькові" }),
  columnHelper.accessor("birth_year", { header: "Рік народження" }),
  columnHelper.accessor("death_year", { header: "Рік смерті" }),
  columnHelper.accessor("occupation", { header: "Рід занять" }),
  columnHelper.accessor("grave_section", { header: "Сектор" }),
];

export default function GravesTable({ graves }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const data = useMemo(() => graves, [graves]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Пошук..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: "16px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "16px",
          boxSizing: "border-box",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "2px solid #333",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted()] ?? ""}
                  </th>
                ))}
                <th style={{ borderBottom: "2px solid #333" }}></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <Link href={`/grave/${row.original.id}`}>Переглянути</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <p style={{ padding: "16px", color: "#666" }}>
            Нічого не знайдено.
          </p>
        )}
      </div>
    </div>
  );
}
