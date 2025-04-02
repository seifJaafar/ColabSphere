"use client";
import React, { useState, useEffect } from "react";
import Data from "@/data/NavList";
import MagicButton from "@/components/ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const { NavList } = Data;

  // Listen for scroll event to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Change 50 to whatever scroll offset you prefer
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <a className="text-white text-xl font-bold" href="/">
          ColabSphere
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6">
          {NavList.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="text-white hover:border-b-2 hover:border-b-white-100 transition duration-300"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Register and Login Buttons */}
        <div className="hidden lg:flex space-x-4">
          <a href="/register">
            <MagicButton title="Register" white={true} />
          </a>
          <a href="/login">
            <MagicButton title="Login" />
          </a>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black text-white absolute top-16 left-1/2 transform -translate-x-1/2 w-full h-screen py-4">
          <div className="flex flex-col py-10 px-10 items-start space-y-4 h-full">
            {NavList.map((item) => (
              <a
                key={item.id}
                href={item.url}
                className="text-white text-left text-2xl hover:border-b-2 hover:border-b-white-100 transition duration-300"
              >
                {item.title}
              </a>
            ))}
            <a href="/register" className="w-[50%]">
              <MagicButton title="Register" white={true} />
            </a>
            <a href="/login" className="w-[50%]">
              <MagicButton title="Login" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
