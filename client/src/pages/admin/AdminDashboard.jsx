import { Container, Row, Col } from "react-bootstrap";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="dashboard mt-5">
      <Container fluid>
        <Row>
          <Col md={2} className="dashboard__sidebar" style={{overflow:"hidden"}}>
            <Sidebar>
              <Menu iconShape="square">
                <MenuItem
                  component={<Link to="/admin/dashboard/manageusers" />}
                >
                  Manage Users
                </MenuItem>
                <MenuItem component={<Link to="/admin/dashboard/viewtours" />}>
                  View Tours
                </MenuItem>
                <MenuItem
                  component={<Link to="/admin/dashboard/updateprofile" />}
                >
                  View Profile
                </MenuItem>
                <MenuItem
                  component={<Link to="/admin/dashboard/manageorders" />}
                >
                  Manage Orders
                </MenuItem>
              </Menu>
            </Sidebar>
          </Col>

          <Col className="" md={10}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
