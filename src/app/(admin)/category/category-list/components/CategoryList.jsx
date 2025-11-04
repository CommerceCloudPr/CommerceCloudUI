"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, Col, Row } from "react-bootstrap";

const CategoryList = () => {

  const [originalData, setOriginalData] = useState([])
  const session = localStorage.getItem('session_token');
  const [open, setOpen] = useState({});
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 2;

  const toggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const rootCategories = useMemo(() => {
    const seen = new Set(originalData.map(c => c.uuid));
    // çocuk olup root'ta yer almayanları ele
    originalData.forEach(cat => cat.childCategories?.forEach(child => seen.delete(child.uuid)));
    return originalData.filter(cat => seen.has(cat.uuid));
  }, [originalData]);
  // sorting + pagination logic
  const sortedData = useMemo(() => {
    return [...rootCategories].sort((a, b) => {
      const v1 = a[sortField].toLowerCase();
      const v2 = b[sortField].toLowerCase();
      if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
      if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, rootCategories]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const paginated = sortedData.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const renderRow = (row, level = 0) => {
    const hasChildren = row.childCategories?.length > 0;

    return (
      <React.Fragment key={row.uuid}>
        <tr>
          <td className="p-3" style={{ paddingLeft: `${level * 20}px`, cursor: hasChildren ? "pointer" : "default" }}
            onClick={() => hasChildren && toggle(row.uuid)}
          >
            {hasChildren ? (open[row.uuid] ? "▼" : "►") : ""} {row.name}
          </td>
          <td>{row.description}</td>
        </tr>

        {open[row.uuid] && row.childCategories?.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };
  useEffect(() => {
    fetch('https://api-dev.aykutcandan.com/product/category/get-all', {
      headers: {
        'Authorization': `Bearer ${decodeURIComponent(session)}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOriginalData(res.data.content)
        /*  {
        id: 1,
        name: "Frontend Team",
        children: [
          { id: 11, name: "React Developer" },
          { id: 12, name: "Next.js Developer" },
        ],
      },
      */
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <CardTitle as={"h4"}>Categories</CardTitle>
          </CardHeader>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                  Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{paginated.map(cat => renderRow(cat))}</tbody>
          </table>

          <div className="d-flex justify-content-center gap-2 my-3">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>

            <span className="fw-bold px-2">{page} / {totalPages}</span>

            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default CategoryList;
