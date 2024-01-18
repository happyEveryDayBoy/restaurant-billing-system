import { Navigate } from "react-router-dom";
import getCookie from "../../helpers/getCookie";

const isAuthenticated = () => {
	return getCookie("user");
};

const ProtectedRoute = ({ element: Element }) => {
	return isAuthenticated() ? Element : <Navigate to="/login" />;
};

export default ProtectedRoute;
