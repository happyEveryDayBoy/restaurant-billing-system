import "bootstrap/dist/css/bootstrap.min.css";


import { RouterProvider, createHashRouter } from "react-router-dom";

import NewBill from "./views/NewBill"
import OpenBill from "./views/OpenBill";
import Sales from "./views/Sales";
import Expenses from "./views/Expenses";
import Balance from "./views/Balance";
import Login from "./views/login/Login";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import { useReportDownload } from "./hooks/useReportDownload";
import Reports from "./views/Reports";


const router = createHashRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<NewBill />} />
  },
  {
    path: "/new",
    element: <ProtectedRoute element={<NewBill />} />
  },
  {
    path: "/open",
    element: <ProtectedRoute element={<OpenBill />} />
  },
  {
    path: "/sales",
    element: <ProtectedRoute element={<Sales />} />
  },
  {
    path: "/expenses",
    element: <ProtectedRoute element={<Expenses />} />
  },
  {
    path: "/balance",
    element: <ProtectedRoute element={<Balance />} />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/reports",
    element: <Reports />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
