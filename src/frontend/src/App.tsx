import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { LockScreen } from "./pages/LockScreen";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const lockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LockScreen,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: History,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/" />,
});

const routeTree = rootRoute.addChildren([
  lockRoute,
  dashboardRoute,
  historyRoute,
  adminRoute,
  catchAllRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
