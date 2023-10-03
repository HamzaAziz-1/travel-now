import { useLocation } from "react-router-dom"
export const RouteConfig = () => {
  const location = useLocation();
 
  
  const excludedRoutes = [
  "/admin/dashboard",
  "/login",
  "/register",
  "/tours/search",
  "/admin/dashboard/manageusers",
  "/admin/dashboard/viewtours",
  "/admin/dashboard/updateprofile",
  "/admin/dashboard/manageorders",
  "/das",
];
const excludedHeaderRoutes = ["/das"];

const shouldExcludeFooter = excludedRoutes.includes(location.pathname);
const shouldExcludeHeader = excludedHeaderRoutes.includes(location.pathname);

return { shouldExcludeFooter, shouldExcludeHeader };
}
export default RouteConfig