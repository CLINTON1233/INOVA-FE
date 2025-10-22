"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Home,
  FileText,
  Shield,
  Calendar,
  HelpCircle,
  Settings,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  User as UserIcon,
  Key,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LayoutDashboard({ children, activeMenu }) {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Home", hasDropdown: false, href: "/dashboard" },
    { icon: FileText, label: "Inventory Data", hasDropdown: true, href: "/inventory-data" },
    {
      icon: Shield,
      label: "Serial Scanning",
      hasDropdown: true,
      href: "/scanning",
    },
    { icon: HelpCircle, label: "Validation & Verification", hasDropdown: true , href: "/validation-verification" },
    { icon: Calendar, label: "History & Activity Log", hasDropdown: true , href: "/history" },
    { icon: Settings, label: "Reports & Analytics", hasDropdown: true, href: "/reports-analytics" },
    { icon: Settings, label: "System Settings", hasDropdown: true },
  ];

  // Handle click outside untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Logic logout disini
    console.log("Logging out...");
    // Contoh: clear localStorage, redirect ke login page, dll.
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔹 Top Navbar - Mobile & Desktop */}
      <nav className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex items-center space-x-2">
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>

            {/* User Dropdown - Desktop */}
            <div className="hidden md:block relative" ref={userDropdownRef}>
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <User className="w-4 h-4" />
                <span>Clinton Alfaro</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Clinton Alfaro</p>
                    <p className="text-xs text-gray-500">clinton.alfaro@seatrium.com</p>
                  </div>
                  
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      // Navigate to profile page
                    }}
                  >
                    <UserIcon className="w-4 h-4 mr-3 text-gray-500" />
                    Profile Saya
                  </button>
                  
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      // Navigate to change password page
                    }}
                  >
                    <Key className="w-4 h-4 mr-3 text-gray-500" />
                    Ubah Password
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        <div className="hidden md:block bg-blue-600 px-4">
          <div className="flex flex-wrap items-center gap-1 py-2">
            {menuItems.map((item, index) => {
              const isActive =
                activeMenu !== undefined
                  ? index === activeMenu
                  : index === activeMenuIndex;

              return (
                <button
                  key={index}
                  className={`flex items-center space-x-1 px-3 py-2 text-white hover:bg-blue-700 whitespace-nowrap text-sm transition ${
                    isActive ? "bg-blue-700" : ""
                  }`}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href);
                    } else {
                      setActiveMenuIndex(activeMenuIndex === index ? null : index);
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </button>
              );
            })}

            <div className="ml-auto text-white text-sm py-2 px-3 opacity-80">
              Monday, 29 September 2025
            </div>
          </div>
        </div>
      </nav>

      {/* 🔹 Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-blue-600 z-50 md:hidden overflow-y-auto">
            <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-1 border-t-2 border-blue-600 rounded-full"></div>
                </div>
                <span className="text-white font-bold">Seatrium</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* User Section with Dropdown for Mobile */}
            <div className="bg-blue-500 px-4 py-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-400 rounded flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">
                  Clinton Alfaro
                </div>
                <button 
                  className="text-blue-100 text-xs flex items-center"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span>Account</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Mobile User Dropdown */}
            {userDropdownOpen && (
              <div className="bg-blue-400 px-4 py-2 space-y-2">
                <button className="flex items-center w-full text-white text-sm hover:bg-blue-500 px-2 py-1 rounded transition">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile Saya
                </button>
                <button className="flex items-center w-full text-white text-sm hover:bg-blue-500 px-2 py-1 rounded transition">
                  <Key className="w-4 h-4 mr-2" />
                  Ubah Password
                </button>
                <div className="border-t border-blue-300 my-1"></div>
                <button 
                  className="flex items-center w-full text-red-200 text-sm hover:bg-blue-500 px-2 py-1 rounded transition"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}

            <div className="py-2">
              {menuItems.map((item, index) => {
                const isActive =
                  activeMenu !== undefined
                    ? index === activeMenu
                    : index === activeMenuIndex;
                return (
                  <button
                    key={index}
                    className={`flex items-center space-x-1 px-3 py-2 text-white hover:bg-blue-700 whitespace-nowrap text-sm transition ${
                      isActive ? "bg-blue-700" : ""
                    }`}
                    onClick={() => {
                      if (item.href) {
                        router.push(item.href);
                        setMobileMenuOpen(false);
                      } else {
                        setActiveMenuIndex(
                          activeMenuIndex === index ? null : index
                        );
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-blue-700 px-4 py-3 text-white text-xs text-center">
              Monday, 29 September 2025
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {children}
      </div>
    </div>
  );
}