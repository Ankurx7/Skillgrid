import { useEffect, useState, useRef } from "react";
import {
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Logo/skillgrid.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import { login } from "../../services/operations/authAPI";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCoursesMenuOpen, setIsCoursesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data?.data || []);
      } catch (error) {

        setSubLinks([]);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
        setIsCoursesMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const handleDummyLogin = () => {
    const dummyEmail = "9506479799rahul@gmail.com";
    const dummyPassword = "1234567";
    dispatch(login(dummyEmail, dummyPassword, navigate));
  };

  return (
    <div className="relative z-50">
      <div className="bg-transparent text-black backdrop-blur-sm">
        <div className="flex h-14 items-center justify-center">
          <div className="flex w-11/12 max-w-[1320px] items-center justify-between">
            <Link to="/">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="SkillGrid Logo"
                  className="w-[100px] h-auto object-contain"
                  loading="lazy"
                />
                <span className="text-lg font-semibold hidden sm:inline">SkillGrid</span>
              </div>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex gap-x-5 text-[1.1rem] font-medium">
                {NavbarLinks.map((link, index) => (
                  <li key={index} className="relative group leading-[1.7rem]">
                    {link.title === "Courses" ? (
                      <>
                        <div
                          className={`flex items-center gap-1 cursor-pointer px-2 rounded transition-all ${
                            matchRoute("/catalog/:catalogName")
                              ? "text-blue-300 font-semibold"
                              : "hover:text-blue-400"
                          }`}
                          onClick={() => setIsCoursesMenuOpen(!isCoursesMenuOpen)}
                        >
                          {link.title}
                          <BsChevronDown size={13} />
                        </div>

                        {isCoursesMenuOpen && (
                          <div className="absolute top-full left-0 z-50 mt-2 w-[220px] rounded-lg bg-white text-black shadow-md ring-1 ring-gray-300 animate-fadeIn">
                            <div className="p-2">
                              {loading ? (
                                <p className="text-center text-sm text-gray-500">Loading...</p>
                              ) : subLinks.length > 0 ? (
                                subLinks
                                  .filter((subLink) => subLink?.courses?.length > 0)
                                  .map((subLink, i) => (
                                    <Link
                                      to={`/catalog/${subLink.name
                                        .split(" ")
                                        .join("-")
                                        .toLowerCase()}`}
                                      key={i}
                                      className="block px-3 py-2 text-sm rounded hover:bg-gray-100"
                                      onClick={() => setIsCoursesMenuOpen(false)}
                                    >
                                      {subLink.name}
                                    </Link>
                                  ))
                              ) : (
                                <p className="text-center text-xs text-gray-500">No Courses Found</p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link to={link?.path}>
                        <p
                          className={`px-2 py-1 rounded transition-colors ${
                            matchRoute(link?.path)
                              ? "text-blue-300 font-semibold"
                              : "hover:text-blue-400"
                          }`}
                        >
                          {link.title}
                        </p>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative">
                  <AiOutlineShoppingCart className="text-xl hover:text-blue-300 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {token === null ? (
                <>
                  <button
                    onClick={handleDummyLogin}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 transition border border-blue-600"
                  >
                    Demo Login
                  </button>
                  <Link to="/login">
                    <button className="rounded bg-white/10 px-3 py-1 text-xs hover:bg-white/20 transition border border-white/20">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="rounded bg-white/10 px-3 py-1 text-xs hover:bg-white/20 transition border border-white/20">
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : (
                <ProfileDropdown />
              )}
            </div>

            <button
              className="md:hidden hover:text-blue-300 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AiOutlineMenu size={22} />
            </button>
{isMobileMenuOpen && (
  <div
    ref={menuRef}
    className="absolute top-14 left-0 w-full bg-white text-black shadow-md z-40 md:hidden transition-all"
  >
    <ul className="flex flex-col gap-4 p-4">
      {NavbarLinks.map((link, index) => (
        <li key={index} className="border-b pb-2">
          {link.title === "Courses" ? (
            <details>
              <summary className="cursor-pointer">{link.title}</summary>
              <div className="ml-4 mt-2">
                {subLinks.map((subLink, i) => (
                  <Link
                    key={i}
                    to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1 text-sm text-gray-700 hover:text-blue-500"
                  >
                    {subLink.name}
                  </Link>
                ))}
              </div>
            </details>
          ) : (
            <Link
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-800 hover:text-blue-500"
            >
              {link.title}
            </Link>
          )}
        </li>
      ))}

      {}
      {!token ? (
        <>
          <button
            onClick={handleDummyLogin}
            className="w-full text-left text-sm py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
          >
            Demo Login (Student)
          </button>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full text-left text-sm py-2">Log In</button>
          </Link>
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full text-left text-sm py-2">Sign Up</button>
          </Link>
        </>
      ) : (
<div className="pt-2 flex justify-center">
  <div className="w-fit">
    <ProfileDropdown />
  </div>
</div>

      )}
    </ul>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
