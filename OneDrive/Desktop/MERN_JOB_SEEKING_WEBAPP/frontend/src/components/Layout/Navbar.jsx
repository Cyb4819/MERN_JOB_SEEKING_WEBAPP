import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../main";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false); // mobile main nav toggle
  const [showDropdownMenu, setShowDropdownMenu] = useState(false); // desktop user menu
  const [showMobileSidebar, setShowMobileSidebar] = useState(false); // mobile user sidebar

  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const mobileSidebarRef = useRef(null);
  const desktopDropdownRef = useRef(null);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = showMobileSidebar ? "hidden" : "auto";
  }, [showMobileSidebar]);

  // Close mobile sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showMobileSidebar &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(e.target)
      ) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSidebar]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showDropdownMenu &&
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        setShowDropdownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdownMenu]);

  // Close menus on route change
  useEffect(() => {
    setShow(false);
    setShowDropdownMenu(false);
    setShowMobileSidebar(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
        <div className="container">
          <div className="logo">
            <Link to={"/"}>
              <img src="/JobZee-logos__white.png" alt="logo" />
            </Link>
          </div>

          <ul className={!show ? "menu" : "show-menu menu"}>
            <li>
              <Link to="/" onClick={() => setShow(false)}>HOME</Link>
            </li>
            <li>
              <Link to="/job/getall" onClick={() => setShow(false)}>ALL JOBS</Link>
            </li>
            <li>
              <Link to="/applications/me" onClick={() => setShow(false)}>
                {user?.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"}
              </Link>
            </li>

            {user?.role === "Employer" && (
              <>
                <li>
                  <Link to="/job/post" onClick={() => setShow(false)}>POST NEW JOB</Link>
                </li>
                <li>
                  <Link to="/job/me" onClick={() => setShow(false)}>VIEW YOUR JOBS</Link>
                </li>
              </>
            )}

            {user && (
              <li>
                <button
                  className="nav-link-btn"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      setShowMobileSidebar(true);
                    } else {
                      setShowDropdownMenu(true);
                    }
                  }}
                >
                  {user.name}
                </button>
              </li>
            )}
          </ul>

          <div className="hamburger">
            <GiHamburgerMenu onClick={() => setShow(!show)} />
          </div>
        </div>
      </nav>

      {/* Desktop Dropdown Menu (right side) */}
      {showDropdownMenu && window.innerWidth > 768 && (
        <div className="user-dropdown-panel" ref={desktopDropdownRef}>
          <button className="dropdown-close-btn" onClick={() => setShowDropdownMenu(false)}>
            &times;
          </button>

          <div className="user-dropdown-content">
            <h3>{user?.name}</h3>
            <ul>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Sidebar (left side) */}
      {showMobileSidebar && (
        <aside
          className="mobile-user-sidebar active"
          ref={mobileSidebarRef}
          role="dialog"
          aria-label="User Menu"
        >
          <button className="sidebar-close-btn" onClick={() => setShowMobileSidebar(false)}>
            &larr; Back
          </button>

          <div className="sidebar-content">
            <h3>{user?.name}</h3>
            <ul>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </aside>
      )}
    </>
  );
};

export default Navbar;
