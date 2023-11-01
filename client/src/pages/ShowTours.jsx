import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { BASE_URL } from "./../utils/config";
import { useGlobalContext } from "./../context/AuthContext";
import "../styles/show-tours.css";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
const ShowTours = () => {
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(false)
  const { user } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.role === "vendor") {
      setLoading(true)
      axios
        .get(`${BASE_URL}/tours/vendor/${user._id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setData(response.data.tours);
          setLoading(false)
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      setLoading(true);
      axios
        .get(`${BASE_URL}/tours`)
        .then((response) => {
          setData(response.data.tours);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error);
        });
    }
  }, [user]);

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_URL}/tours/${id}`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setData(data.filter((t) => t.id !== id));
      })
      .catch((err) => console.log(err));
  };
  const handleVerify = (id) => {
    axios
      .patch(`${BASE_URL}/tours/verify/${id}`, {}, { withCredentials: true })
      .then((res) => {
        const updatedTours = data.map((tour) => {
          if (tour.id === id) {
            return res.data.tour;
          }
          return tour;
        });
        setData(updatedTours);
      })
      .catch((err) => console.log(err));
  };

  const handleFeatured = (id) => {
    axios
      .patch(`${BASE_URL}/tours/feature/${id}`, {}, { withCredentials: true })
      .then((res) => {
        const updatedTours = data.map((tour) => {
          if (tour.id === id) {
            return res.data.tour;
          }
          return tour;
        });
        setData(updatedTours);
      })
      .catch((err) => console.log(err));
  };

  const filteredData = data.filter((tour) => {
    if (filter === "verified") {
      return tour.verified === true;
    } else if (filter === "unverified") {
      return tour.verified === false;
    }
    return true; // Show all if filter is "all"
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {loading ? (<Spinner/>): (
        <Container className="show-tours-container">
      <div className="tours-container">
        <h1 className="mb-4">Tour Packages</h1>
        <div className="filter-container mb-4">
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="form-select-filter"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <div className="table-responsive">
          <Table striped bordered hover className="tours-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City Name</th>
                <th>Update</th>
                {user && user.role === "admin" && <th>Verify</th>}
                {user && user.role === "admin" && <th>Feature</th>}
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems().map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <Link className="custom-link" to={`/tour/${tour.id}`}>
                      {tour.title}
                    </Link>
                  </td>
                  <td>{tour.city}</td>
                  <td>
                    <Link
                      className="action-link"
                      to={`/${user?.role}/dashboard/update-tour/${tour.id}`}
                    >
                      <Button className="action-button update-button">
                        Update
                      </Button>
                    </Link>
                  </td>
                  {user && user.role === "admin" && (
                    <td>
                      {!tour.verified ? (
                        <Button
                          className="action-button verify-button"
                          onClick={() => handleVerify(tour.id)}
                        >
                          Verify
                        </Button>
                      ) : (
                        <Button
                          className="action-button unverify-button"
                          onClick={() => handleVerify(tour.id)}
                        >
                          Unverify
                        </Button>
                      )}
                    </td>
                  )}
                  {user && user.role === "admin" && (
                    <td>
                      {!tour.featured ? (
                        <Button
                          className="action-button feature-button"
                          onClick={() => handleFeatured(tour.id)}
                        >
                          Feature
                        </Button>
                      ) : (
                        <Button
                          className="action-button unfeature-button"
                          onClick={() => handleFeatured(tour.id)}
                        >
                          Unfeature
                        </Button>
                      )}
                    </td>
                  )}
                  <td>
                    <Button
                      className="action-button delete-button"
                      onClick={() => handleDelete(tour.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Custom pagination */}
      <div className="custom-pagination-container text-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`btn btn-outline-warning mx-1 ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          &lt; Prev
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`btn ${
              currentPage === index + 1
                ? "btn-warning active__page"
                : "btn-outline-warning"
            } mx-1`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`btn btn-outline-warning mx-1 ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          Next &gt;
        </button>
      </div>
    </Container >
      )}
            </>
  );
};

export default ShowTours;
