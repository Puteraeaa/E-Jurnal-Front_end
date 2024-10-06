import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import { useDispatch } from "react-redux";
import Api from "../api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import swal from "sweetalert2";
import routes from "../routes/sidebar";

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));

  const [profile, setProfile] = useState([]);
  const [imageUpdated, setImageUpdated] = useState(false); // State to track image updates

  const getUser = async () => {
    try {
      const response = await Api.get(`/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data);
      setImageUpdated(false); // Reset after fetching
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, [user.id, imageUpdated]); // Add imageUpdated to dependency array

  const logout = async (e) => {
    e.preventDefault();
    const result = await swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout!",
    });

    if (result.isConfirmed) {
      try {
        await Api.post("/logout");

        // Remove cookies on successful logout
        Cookies.remove("user");
        Cookies.remove("token");
        Cookies.remove("permissions");

        toast.success("Logout Successfully!", {
          position: "top-right",
          duration: 4000,
        });

        // Navigate to the homepage or login page
        navigate("/");
      } catch (error) {
        toast.error("Failed to logout. Please try again.", {
          position: "top-right",
          duration: 4000,
        });
        console.error("Logout error:", error);
      }
    }
  };

  const close = () => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
        <button
          className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={close}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">
          <Link to={"/app/dashboard"}>
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
           src={ profile?.student?.image && profile?.student?.image !== "https://api.jurnal.pplgsmkn1ciomas.my.id/storage" 
            ? profile.student.image 
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }
          
            alt="Profile"
            className="w-12 h-12 object-cover cursor-pointer rounded-full mr-5"
          />
          <div>
            <div className="text-auto font-semibold">{profile.student?.name || profile.teachers?.name || profile.industries?.name || profile.name}</div>
            <div className="text-sm">{profile.roles}</div>
          </div>

          <div className="divider mt-0 mb-0"></div>
        </Link>

        {routes.map((route, k) => {
          return (
            <li key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${isActive ? "font-semibold bg-base-200" : "font-normal"}`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-[#3b82f5]"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}

        <button
          onClick={logout}
          className="flex items-center text-red-600 hover:bg-red-100 pr-5 pl-5 p-2 w-full rounded-tr-md"
        >
          <ArrowRightOnRectangleIcon className="mr-5 w-5" />
          Logout
        </button>
      </ul>
    </div>
  );
}

export default LeftSidebar;
