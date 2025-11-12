"use client";
import React, { createContext, useContext, useState } from "react";

const MenuContext = createContext(undefined);

export const MenuProvider = ({ children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <MenuContext.Provider
      value={{ showMobileMenu, setShowMobileMenu, currentPage, setCurrentPage }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
