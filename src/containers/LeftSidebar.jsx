import routes from "../routes/sidebar";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useDispatch } from "react-redux";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";

function LeftSidebar() {
  const location = useLocation();

  const dispatch = useDispatch();

  function logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

  const close = (e) => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="drawer-side  z-30  ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-80 bg-base-100 min-h-full   text-base-content">
        <button
          className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">
          <Link to={"/app/dashboard"}>
            {" "}
            <img
              src={"/smk.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-1"
            />{" "}
            E-Jurnal
          </Link>{" "}
        </li>

        <Link
          to={"/app/settings-profile"}
          className="p-4 flex items-center mb-1 mt-1 hover:bg-base-200 MR-2 ml-1"
        >
          <img
            src={"/intro.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-5"
          />
          <div>
            <div className="text-sm">Admin</div>
            <div className="text-lg font-semibold">Akun</div>
          </div>

          <div className="divider mt-0 mb-0"></div>
        </Link>

        {routes.map((route, k) => {
          return (
            <li className="" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-semibold  bg-base-200 " : "font-normal"
                    }`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-secondary "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}

        <Link
          to={"/"}
          className="flex items-center text-red-600 hover:bg-red-100 pr-5 pl-5 p-2 w-full  rounded-tr-md "
        >
          <ArrowRightOnRectangleIcon className="mr-5 w-5" />
          Logout
        </Link>
      </ul>
    </div>
  );
}

export default LeftSidebar;
