import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
import { Pagination } from "react-bootstrap";
import "../../styles/manage-users.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/config";
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("tourist");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`)
      .then((response) => {
        const result = response.data.users;
        const verifiedUsers = result.filter(
          (user) => user.isVerified && user.role === role
        );

        setUsers(verifiedUsers);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [role]);

  const toggleBlockUser = (userId, isBlocked) => {
    fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !isBlocked }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(
          users.map((user) =>
            user._id === data.user._id
              ? { ...user, isBlocked: data.user.isBlocked }
              : user
          )
        );
      })
      .catch((err) => toast.error(err));
  };

  const filteredUsers = users.filter(
    (user) =>
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Spinner />;
  }

  // Calculate pagination boundaries
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const displayedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3 custom-header">Manage Users</h1>
      <select
        className="form-select mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="tourist">Tourists</option>
        <option value="vendor">Vendors</option>
      </select>
      <input
        type="text"
        placeholder="Search by User's Email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-3"
      />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">User Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <Link
                  className="custom-link"
                  target="_blank"
                  to={`/users/${user._id}`}
                >
                  {user.name}
                </Link>
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className={`btn ${
                    user.isBlocked ? "btn-primary" : "btn-danger"
                  }`}
                  onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"} User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({
          length: Math.ceil(filteredUsers.length / itemsPerPage),
        }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
          }
        />
      </Pagination>
    </div>
  );
}

export default ManageUsers;
