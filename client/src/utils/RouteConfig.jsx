import { useLocation } from "react-router-dom"
export const RouteConfig = () => {
  const location = useLocation();
  const excludedRoutes = [
    "/admin/dashboard",
    "/login",
    "/register",
    "/tours/search",
    "/admin/dashboard/manage-users",
    "/admin/dashboard/view-tours",
    "/admin/dashboard/update-profile",
    "/admin/dashboard/view-orders",
    "/vendor/dashboard",
    "/vendor/dashboard/create-tour",
    "/vendor/dashboard/view-tours",
    "/vendor/dashboard/orders",
    "/vendor/dashboard/update-tour/:id",
    "/tourist/dashboard",
    "/admin/dashboard",
    "/vendor/dashboard",
    "/chat"
  ];
const excludedHeaderRoutes = ["/chat"];

const shouldExcludeFooter = excludedRoutes.includes(location.pathname);
const shouldExcludeHeader = excludedHeaderRoutes.includes(location.pathname);

return { shouldExcludeFooter, shouldExcludeHeader };
}
export default RouteConfig