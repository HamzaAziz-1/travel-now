import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../../styles/manage-order.css";
import { Alert, Table, Badge, Pagination } from "react-bootstrap";
import Spinner from "../../components/Spinner/Spinner";
import { useGlobalContext } from "../../context/AuthContext";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { user } = useGlobalContext();

  useEffect(() => {
    axios
      .get("/api/v1/orders/showAllMyOrders")
      .then((response) => {
        setOrders(response.data.orders);
        setLoading(false);
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
  console.log(orders);
  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
    <div className="container mt-5" style={{ height: "100vh" }}>
      <h1 className="text-center mb-5 " style={{ color: "#4b6584" }}>
        Manage Orders
      </h1>
      <select
        className="form-select mb-5"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Orders</option>
        <option value="paid">Paid</option>
        <option value="completed">Completed</option>
      </select>
      <Table responsive="md" striped bordered hover>
        <thead style={{ backgroundColor: "#334d50", color: "white" }}>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Tour</th>
            {user?.role === "vendor" ? (
              <th scope="col">Tourist</th>
            ) : (
              <th scope="col">Vendor</th>
            )}
            <th scope="col">Amount</th>
            <th scope="col">Day & Time Slot</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) =>
            order.orderItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link to={`/orders/${order._id}`} className="custom-link">
                    {order._id}
                  </Link>
                </td>
                <td>
                  <Link to={`/tour/${item.tour._id}`} className="custom-link">
                    {item.tour.title}
                  </Link>
                </td>
                {user?.role === "vendor" ? (
                  <td>
                    <Link
                      to={`/users/${order.user._id}`}
                      className="custom-link"
                    >
                      {order.user.name}
                    </Link>
                  </td>
                ) : (
                  <td>
                    <Link
                      to={`/users/${item?.vendor._id}`}
                      className="custom-link"
                    >
                      {item.vendor.name}
                    </Link>
                  </td>
                )}

                <td>{order.total}</td>
                <td>
                  {item.availableDays}{" "}
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-arrow"
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
            className="pagination-item"
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        />
      </Pagination>
    </div>
  );
}

export default OrdersPage;
