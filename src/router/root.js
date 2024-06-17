import { Suspense, lazy } from "react";

const { createBrowserRouter } = require("react-router-dom");
const Loading = <div>Loading...</div>
const Index = lazy(() => import("../pages/indexPage"))
const List = lazy(() => import("../pages/listPage"))
const Update = lazy(() => import("../pages/UpdatePage"))
const SignUp = lazy(() => import("../pages/signUpPage"))

const root = createBrowserRouter([
  {
      path: "",
      element: <Suspense fallback={Loading}><Index /></Suspense>,
    },
    {
      path: "playlist/:id/update",
      element: <Suspense fallback={Loading}><Update /></Suspense>,
    },
    {
      path: "playlist/:id/:name",
      element: <Suspense fallback={Loading}><List /></Suspense>,
    }
])

export default root;