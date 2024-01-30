import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import { userPath } from "./routeConfig";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";

function UserRoute() {
  return (
    <Routes>
      <Route element={<PublicRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.login} element={<LogIn />} />
      </Route>
      <Route element={<PrivateRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.home} element={<Home />} />
      </Route>
    </Routes>
  );
}

export default UserRoute;
