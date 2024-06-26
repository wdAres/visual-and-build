import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import useLocalStorage from "./useLocalStorage";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [user, setUser] = useLocalStorage("user", "");
  const [isAuthForm, setIsAuthForm] = useState(false);
  const [checkoutCartData, setCheckoutCartData] = useState();
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [categoriesData, setCategoriesData] = useState();
  const [thankyouData, setThankyouData] = useState();

  const handleWindowResize = () => {
    const windowWidth = window.innerWidth;

    setIsMobile(windowWidth < 768);
    setIsTablet(windowWidth >= 768 && windowWidth <= 1024);
    setIsDesktop(windowWidth > 1024);
  };

  useEffect(() => {
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const appContextValues = {
    isMobile,
    isDesktop,
    isTablet,
    user,
    setUser,
    isAuthForm,
    setIsAuthForm,
    checkoutCartData,
    setCheckoutCartData,
    appliedCoupon,
    setAppliedCoupon,
    categoriesData,
    setCategoriesData,
    thankyouData,
    setThankyouData,
  };

  return (
    <AppContext.Provider value={appContextValues}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { useAppContext, AppContextProvider };
