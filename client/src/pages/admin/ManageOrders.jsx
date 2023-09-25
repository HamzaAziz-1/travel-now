import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
import { Link } from "react-router-dom";
import "../../styles/manage-order.css";
import { Alert, Table, Badge, Pagination } from "react-bootstrap";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/orders")
      .then((response) => {
        const fetchedOrders = response.data.orders;
        const userPromises = fetchedOrders.map((order) =>
          axios.get(`/api/v1/users/${order.user}`)
        );
        const vendorPromises = fetchedOrders.map((order) =>
          axios.get(`/api/v1/users/${order.orderItems[0].vendor}`)
        );

        Promise.all([...userPromises, ...vendorPromises])
          .then((responses) => {
            const users = responses
              .slice(0, fetchedOrders.length)
              .map((res) => res.data.user);
            const vendors = responses
              .slice(fetchedOrders.length)
              .map((res) => res.data.user);
            const ordersWithUserAndVendor = fetchedOrders.map(
              (order, index) => ({
                ...order,
                user: users[index],
                vendor: vendors[index],
              })
            );

            setOrders(ordersWithUserAndVendor);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
            setError("Failed to fetch data");
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5">
        {error}
      </Alert>
    );
  }

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "all" || order.status === statusFilter) &&
      (searchQuery === "" ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function getStatusBadgeVariant(status) {
    switch (status) {
      case "paid":
        return "success";
      case "completed":
        return "info";
      default:
        return "secondary";
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5" style={{ color: "#4b6584" }}>
        Manage Orders
      </h1>
      <div className="">
        <select
          className="form-select mb-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="paid">Paid</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control mb-3"
        />
      </div>
      <Table responsive="md" striped bordered hover>
        <thead style={{ backgroundColor: "#334d50", color: "white" }}>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Tour</th>
            <th scope="col">Tourist</th>
            <th scope="col">Vendor</th>
            <th scope="col">Amount</th>
            <th scope="col">Date & Time Slot</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) =>
            order.orderItems.map((item) => (
              <tr key={item._id}>
                <td>{order._id}</td>
                <td>
                  <Link to={`/tour/${item.tour}`} className="custom-link">
                    {item.name}
                  </Link>
                </td>
                <td>
                  <Link to={`/users/${order.user._id}`} className="custom-link">
                    {order.user.name}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/users/${order.vendor._id}`}
                    className="custom-link"
                  >
                    {order.vendor.name}
                  </Link>
                </td>
                <td>{order.total}</td>
                <td>
                  {item.date}{" "}
                  {item.timeSlots
                    .map((slot) => `${slot.start} - ${slot.end}`)
                    .join(", ")}
                </td>
                <td>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          disabled={currentPage === 1}
          className="pagination-arrow"
        />
        {Array.from(
          { length: Math.ceil(filteredOrders.length / itemsPerPage) },
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
              className="pagination-item"
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredOrders.length / itemsPerPage)
          }
          className="pagination-arrow"
        />
      </Pagination>
    </div>
  );
}

export default ManageOrders;
