import { lazy, Suspense } from "react";
import { userPath } from "./routeConfig";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";

const Home = lazy(() => import("../pages/Home"));
const MyList = lazy(() => import("../pages/MyList"));
const LogIn = lazy(() => import("../pages/LogIn"));
const Register = lazy(() => import("../pages/Register"));
const ResetOTP = lazy(() => import("../pages/ResetOTP"));
const RegisterOTP = lazy(() => import("../pages/RegisterOTP"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));

function UserRoute() {
  return (
    <Routes>
      <Route element={<PublicRoute role={"user"} route={userPath.home} />}>
        <Route path={userPath.login} element={<LogIn />} />
        <Route path={userPath.resetOTP} element={<ResetOTP />} />
        <Route path={userPath.register} element={<Register />} />
        <Route path={userPath.registerOTP} element={<RegisterOTP />} />
        <Route path={userPath.resetPassword} element={<ResetPassword />} />
        <Route path={userPath.forgotPassword} element={<ForgotPassword />} />
        <Route path={userPath.home} element={<Home />} />
        <Route path={userPath.list} element={<MyList />} />
      </Route>
      <Route element={<PrivateRoute role={"user"} route={userPath.home} />}>
      </Route>
    </Routes>
  );
}

export default function UserRouteWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative h-24 w-24">
            <div className="rounded-full h-24 w-24 border-t-4 border-t-pine-green animate-spin absolute"></div>
            <div className="h-full w-full flex justify-center items-center">
              <div className=" animate-ping mt-2">
                <div className="inline-block w-6 h-6 bg-pine-green rounded-sm mx-1"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <UserRoute />
    </Suspense>
  );
}
