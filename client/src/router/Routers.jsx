import { Routes, Route, Navigate } from "react-router-dom";
import {
  AdminDashboard,
  TourDetailsAdmin,
  OrderDetailsPage,
  UpdateProfile,
  TourVendorDetails,
  TouristDashboard,
  Error,
  Verify,
  ForgotPassword,
  ResetPassword,
  Login,
  Register,
  CreateTour,
  UpdateTour,
  VendorDashboard,
  AttractionList,
  PlaceDetails,
  ManageOrders,
  ManageUsers,
  ShowTours,
  OrdersPage,
} from "../pages";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import PrivateRoute from "../shared/PrivateRoute";
import Checkout from "../pages/Checkout";
import Newsletter from "../shared/Newsletter";
import SearchResultList from "../pages/SearchResultList";
import ThankYou from "../pages/ThankYou";
import Messenger from "../components/Chat/Messenger";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/contact-us" element={<Newsletter />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/tour/:id" element={<TourDetailsAdmin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search/spots" element={<AttractionList />} />
      <Route path="/users/:id" exact element={<TourVendorDetails />}></Route>
      <Route path="/forgot-password" exact element={<ForgotPassword />}></Route>
      <Route path="*" element={<Error />}></Route>
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/:type/:id" element={<PlaceDetails />} />
      <Route
        path="/checkout"
        exact
        element={
          <PrivateRoute roles={"tourist"}>
            <Checkout />
          </PrivateRoute>
        }
      ></Route>
      <Route path="/chat" element={<Messenger />} />
      <Route
        path="/orders/:orderId"
        exact
        element={
          <PrivateRoute roles={["vendor", "admin", "tourist"]}>
            <OrderDetailsPage />
          </PrivateRoute>
        }
      ></Route>

      <Route path="/user/verify-email" exact element={<Verify />}></Route>
      <Route
        path="/user/reset-password"
        exact
        element={<ResetPassword />}
      ></Route>

      <Route
        path="/tourist/dashboard"
        element={
          <PrivateRoute roles={"tourist"}>
            <TouristDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<UpdateProfile />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
      <Route
        path="/vendor/dashboard"
        element={
          <PrivateRoute roles={"vendor"}>
            <VendorDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<UpdateProfile />} />
        <Route path="create-tour" element={<CreateTour />} />
        <Route path="update-tour/:id" element={<UpdateTour />} />
        <Route path="view-tours" element={<ShowTours />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roles={"admin"}>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="view-tours" element={<ShowTours />} />
        <Route path="update-tour/:id" element={<UpdateTour />} />
        <Route index element={<UpdateProfile />} />
        <Route path="view-orders" element={<ManageOrders />} />
      </Route>
    </Routes>
  );
};

export default Routers;
