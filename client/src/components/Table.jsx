import React from "react";
import { MdSignalCellularNull } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table/dist/react-table.development";

const Table = ({ data, columns, noHref }) => {
  const navigate = useNavigate();

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // const handleRowClick = (index) => {
  //   if (!noHref) navigate(`/events/${index}`, { state: {adId: data[index].id } });
  // };

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className="cursor-pointer hover:bg-gray-50"
              // onClick={() => handleRowClick(i)}
            >
              {row.cells.map((cell) => {
                if (cell.column.Header === "Date") {
                  if (cell.value !== null && cell.value !== undefined) {
                    if (new Date(cell.value).getTime() < new Date().getTime()) return <td {...cell.getCellProps()}>Finished</td>
                    else return <td {...cell.getCellProps()}>{new Date(cell.value).toString()}</td>
                  } else {
                    return <td {...cell.getCellProps()}>{new Date(new Date().getTime() + Math.random() * (new Date().getTime() - new Date(2021, 0, 1).getTime())).toUTCString()}</td>
                  }
                }
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
