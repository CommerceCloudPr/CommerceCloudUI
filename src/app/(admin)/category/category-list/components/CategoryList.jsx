"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, Col, Row } from "react-bootstrap";

const CategoryList = () => {
  const originalData = [
    {
      id: 1,
      name: "Frontend Team",
      children: [
        { id: 11, name: "React Developer" },
        { id: 12, name: "Next.js Developer" },
      ],
    },
    {
      id: 2,
      name: "Backend Team",
      children: [
        { id: 21, name: "Node.js Developer" },
        { id: 22, name: "Python Developer" },
      ],
    },
    {
      id: 3,
      name: "Mobile Team",
      children: [
        { id: 31, name: "React Native Dev" },
        { id: 32, name: "Flutter Dev" },
      ],
    },
  ];

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

  // sorting + pagination logic
  const sortedData = useMemo(() => {
    return [...originalData].sort((a, b) => {
      const v1 = a[sortField].toLowerCase();
      const v2 = b[sortField].toLowerCase();
      if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
      if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const totalPages = Math.ceil(originalData.length / pageSize);

  

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <CardTitle as={"h4"}>Category List</CardTitle>
          </CardHeader>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("name")}
                >
                  Team / Member{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <React.Fragment key={row.id}>
                  <tr>
                    <td onClick={() => toggle(row.id)} style={{ cursor: "pointer" }}>
                      {open[row.id] ? "▼" : "►"} {row.name}
                    </td>
                  </tr>

                  {open[row.id] &&
                    row.children?.map((child) => (
                      <tr key={child.id}>
                        <td className="ps-4">— {child.name}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>

          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-center gap-2 my-3">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <span className="px-2 fw-bold">{page} / {totalPages}</span>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
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
