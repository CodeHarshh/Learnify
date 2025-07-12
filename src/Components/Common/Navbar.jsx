

import logo from "../../Assets/Logo/Learnify-unscreen.gif"
import { Link, useLocation, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../Data/navbar-links";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ProfileDropDown from "../Core/Auth/profileDropDown";
import { useEffect, useState } from "react";
import { apiConnector } from "../../Services/apiconnector";
import { endpoints } from "../../Services/apis";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();
  const [subLink, setSubLink] = useState([]);

  const fetchCategories = async () => {
    try {
      const result = await apiConnector("GET", endpoints.CATEGORIES_API);
      console.log(result); ///

      setSubLink(result.data || []);
    } catch (error) {
      console.log("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const MatchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} width={90} height={19} loading="lazy" alt="Logo" />
        </Link>

        {/* Navigation Links */}

     

<nav>
  <ul className="flex gap-x-6 text-richblack-25">
    {NavbarLinks.map((link, index) => (
      <li key={index} className="relative group">
      {link.title === "Catalog" ? (
  <div className="relative flex items-center gap-2 group cursor-pointer text-white">
    <p>{link.title}</p>
    <FontAwesomeIcon icon={faChevronDown} />

    {/* Dropdown Box */}
    <div className="invisible absolute left-[60%] top-[90%] z-[1000] w-[220px] lg:w-[280px] 
                    translate-x-[-50%] flex-col rounded-xl bg-gradient-to-br from-richblack-800 to-richblack-900 
                    backdrop-blur-md border border-richblack-700 p-4 
                    text-richblack-100 opacity-0 transition-all duration-300 shadow-2xl 
                    group-hover:visible group-hover:top-[100%] group-hover:opacity-100">

      {/* Rhombus / Pointer */}
      <div className="absolute left-[50%] top-0 h-4 w-4 -translate-x-[50%] -translate-y-1/2 rotate-45 
                      bg-richblack-900 border-t border-l border-r 
                      border-richblack-700 z-[-1]"></div>

      <div className="p-3 rounded-lg">
        <div className="flex flex-col gap-3">
          {subLink.length > 0 &&
            subLink.map((item) => (
              <Link
                to={`/catalog/${item.name}`}
                key={item._id}
                className="text-base font-bold text-richblack-100 hover:text-yellow-300 hover:scale-105 transition-transform duration-200"
              >
                {item.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  </div>
)        : (
          <Link to={link?.path}>
            <p
              className={`relative ${
                MatchRoute(link?.path)
                  ? "text-yellow-25"
                  : "text-richblack-25"
              } group-hover:text-white`}
            >
              {link.title}
              <span
                className="absolute left-0 bottom-[-6px] h-[3px] w-0 bg-[#31d9f6] transition-all duration-300 group-hover:w-full"
              ></span>
            </p>
          </Link>
        )}
      </li>
    ))}
  </ul>
</nav>






        {/* Login/Signup/Dashboard */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
            <FontAwesomeIcon icon={faCartShopping} color="#ffffff" />

              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}


          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] px-[12px] py-[8px] text-white transition-transform duration-300 hover:scale-105 active:scale-95">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700  bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] px-[12px] py-[8px] text-white transition-transform duration-300 hover:scale-105 active:scale-95">
                Sign up
              </button>
            </Link>
          )}


          
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
