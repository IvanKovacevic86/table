import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [order, setOrder] = useState("asc");
  const [sortField, setSortField] = useState("");
  const [search, setSearch] = useState("");
  const [count, setCount] = useState();

  const getNumberOfRows = (records) => {
    return Math.ceil(records.length / rowsPerPage);
  };

  const fetchData = () => {
    axios.get("http://localhost:3004/users").then((response) => {
      setRecords(response.data);
      setFilteredRecords(response.data);
      setCount(getNumberOfRows(response.data));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { label: "Name", accessor: "fullName", sortable: true },
    { label: "Address", accessor: "address", sortable: true },
    { label: "Phone Number", accessor: "phoneNumber", sortable: true },
    { label: "Email", accessor: "email", sortable: false },
  ];

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...records].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setRecords(sorted);
    }
  };

  const handleSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  const handleChange = (event, newPage) => {
    setPage(newPage);
  };

  const recordsAfterPaging = (data) => {
    const lastPostIndex = page * rowsPerPage;
    const firstPostIndex = lastPostIndex - rowsPerPage;

    const pagination = (data) => {
      return data.slice(firstPostIndex, lastPostIndex);
    };

    return pagination(data);
  };

  const dense = false;
  const emptyRows =
    page > 0 ? Math.max(0, page * rowsPerPage - records.length) : 0;

  const keys = ["fullName", "address", "email"];

  const handleSearch = (e) => {
    if (e.target.value.trim() === "") {
      setSearch(e.target.value);
      setFilteredRecords(records);
      setCount(getNumberOfRows(records));

      return;
    }

    setSearch(e.target.value);

    const filtered = records.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(search.toLowerCase()))
    );

    setFilteredRecords(filtered);
    setPage(1);
    setCount(getNumberOfRows(filtered));
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        sx={{ width: "40%", margin: "28px" }}
        onChange={handleSearch}
      />
      <Table>
        <TableHead
          sx={{
            backgroundColor: "#faebd7",
          }}
        >
          <TableRow>
            {columns.map(({ label, accessor, sortable }) => {
              return (
                <TableCell
                  key={accessor}
                  onClick={
                    sortable ? () => handleSortingChange(accessor) : null
                  }
                >
                  {label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {recordsAfterPaging(filteredRecords).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.phoneNumber}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: (dense ? 33 : 53) * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        page={page}
        count={count}
        onChange={handleChange}
        color="secondary"
        size="large"
      />
    </Box>
  );
}

export default App;
