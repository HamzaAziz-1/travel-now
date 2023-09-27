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
  Spinner,
  ManageOrders,
  ManageUsers,
  ShowTours
} from "../pages";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import PrivateRoute from "../shared/PrivateRoute";
import Checkout from "../pages/Checkout";
import Newsletter from "../shared/Newsletter";
import SearchResultList from "../pages/SearchResultList";
import ThankYou from "../pages/ThankYou";
import { useGlobalContext } from "../context/AuthContext";

const Routers = () => {
  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return <Spinner />;
  }
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
      <Route
        path="/tourist/dashboard"
        exact
        element={
          <PrivateRoute roles={"tourist"}>
            <TouristDashboard />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/checkout"
        exact
        element={
          <PrivateRoute roles={"tourist"}>
            <Checkout />
          </PrivateRoute>
        }
      ></Route>
      <Route path="/users/:id" exact element={<TourVendorDetails />}></Route>
      <Route path="/forgot-password" exact element={<ForgotPassword />}></Route>
      <Route
        path="/create-tour"
        exact
        element={
          <PrivateRoute roles={"vendor"}>
            <CreateTour />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/show-tours"
        exact
        element={
          <PrivateRoute roles={["vendor", "admin"]}>
            <ShowTours />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/orders/:orderId"
        exact
        element={
          <PrivateRoute roles={["vendor", "admin", "tourist"]}>
            <OrderDetailsPage />
          </PrivateRoute>
        }
      ></Route>

      <Route
        path="/update-tour/:id"
        exact
        element={
          <PrivateRoute roles={["admin", "vendor"]}>
            <UpdateTour />
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
        path="/vendor/dashboard"
        element={
          <PrivateRoute roles={"vendor"}>
            <VendorDashboard />
          </PrivateRoute>
        }
      ></Route>
      <Route path="*" element={<Error />}></Route>
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/:type/:id" element={<PlaceDetails />} />
      <Route
        path="/tourist/dashboard"
        element={
          <PrivateRoute roles={"tourist"}>
            <TouristDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roles={"admin"}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roles={"admin"}>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route path="manageusers" element={<ManageUsers />} />
        <Route path="viewtours" element={<ShowTours />} />
        <Route path="updateprofile" element={<UpdateProfile />} />
        <Route path="manageorders" element={<ManageOrders />} />
      </Route>

      <Route path="update-profile" element={<UpdateProfile />} />
    </Routes>
  );
};

export default Routers;
