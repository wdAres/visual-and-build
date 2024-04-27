import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Searchbar from "../components/forms/search/Searchbar";
import { navLinks } from "../constants/HeaderLinks";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Cart } from "../assets/cart.svg";
import { useAppContext } from "../context/useAppContext";
import { ReactComponent as HamburgerIcon } from "../assets/hamburger.svg";
import { useAuth } from "../hooks/useAuth";
import StyledMask from "../components/common/StyledMask";
import CanadaIcon from "../assets/canada.png";

const HeaderStyle = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 8;
  background-color: #ae0000;
  .header__wrapper {
    height: 74px;
    display: flex;
    align-items: center;
    gap: 4vw;
    padding: 0 50px;
    width: 100%;
    max-width: 1440px;
    margin: auto;
  }
  nav {
    display: flex;
    gap: 40px;
  }
  .link {
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    line-height: 100%;
    &:last-child {
      margin-bottom: 4px;
    }
  }
  .cart {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
  }
  .other__links {
    display: flex;
    align-items: center;
    gap: 40px;
    > div {
      cursor: pointer;
    }
  }
  .flag__account__wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .canadian__flag {
    padding: 0 2px;
    height: 18px;
    display: inline-block;
    img {
      outline: 1px solid #fff;
      border-radius: 50%;
    }
  }
  .two__liners {
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    span {
      font-size: 9.75px;
      font-weight: 700;
      line-height: 11.25px;
      display: block;
    }
  }
  @media (max-width: 768px) {
    .header__wrapper {
      padding: 0 24px;
      height: 60px;
      justify-content: space-between;
    }
    .logo {
      svg {
        width: 140px;
      }
    }
  }
`;

const Blank = styled.div`
  height: 74px;
  width: 100%;
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const MobileNavStyle = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  width: 100vw;
  padding: 12px 0px;
  background-color: #fff;
  z-index: 5;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.3);
  .link {
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    display: block;
    padding: 10px 20px;
    color: #303030;
  }
`;

const Header = ({ setIsAuthForm }) => {
  const { isDesktop } = useAppContext();
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  const [isNavActive, setIsNavActive] = useState(false);

  useEffect(() => {
    if (isNavActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "inherit";
    }
    return () => (document.body.style.overflow = "inherit");
  }, [isNavActive]);

  return (
    <>
      <Blank />
      <HeaderStyle>
        <div className="header__wrapper">
          <Link to={"/"} className="logo">
            <Logo />
          </Link>
          {isDesktop ? (
            <>
              <nav>
                {navLinks?.map((link) => (
                  <Link className="link" key={link?.id} to={link?.link}>
                    {link?.title}
                  </Link>
                ))}
              </nav>
              <Searchbar />
              <div className="other__links">
                <div
                  onClick={() => {
                    !isLoggedIn ? setIsAuthForm(true) : navigate("/account/");
                  }}
                  className="flag__account__wrapper"
                >
                  <span className="canadian__flag">
                    <img src={CanadaIcon} />
                  </span>
                  <div className="two__liners">
                    Hello, sign in
                    <span>Account & Lists</span>
                  </div>
                </div>
                <Link to={"/account/purchase-history"} className="two__liners">
                  Returns
                  <span>& Orders</span>
                </Link>
                <Link to={"/cart"} className="cart">
                  <Cart />
                  Cart
                </Link>
                {isLoggedIn && (
                  <Link to={"/logout"} className="link">
                    Logout
                  </Link>
                )}
              </div>
            </>
          ) : (
            <HamburgerIcon onClick={() => setIsNavActive((prev) => !prev)} />
          )}
        </div>
      </HeaderStyle>
      {isNavActive && (
        <>
          <StyledMask
            onClick={() => setIsNavActive(false)}
            background={"rgba(0, 0, 0, 0.3)"}
          />
          <MobileNavStyle className="mobile__navigation">
            <nav>
              {navLinks?.map((link) => (
                <Link
                  onClick={() => setIsNavActive(false)}
                  className="link"
                  key={link?.id}
                  to={link?.link}
                >
                  {link?.title}
                </Link>
              ))}
            </nav>
            <div className="other__links">
              <div
                onClick={() => {
                  !isLoggedIn ? setIsAuthForm(true) : navigate("/account/");
                  setIsNavActive(false);
                }}
                className="link"
              >
                Account & Lists
              </div>
              <Link
                onClick={() => setIsNavActive(false)}
                to={"/account/purchase-history"}
                className="link"
              >
                Returns
                <span>& Orders</span>
              </Link>
              <Link
                onClick={() => setIsNavActive(false)}
                to={"/cart"}
                className="link"
              >
                Cart
              </Link>
              {isLoggedIn && (
                <Link
                  onClick={() => setIsNavActive(false)}
                  to={"/logout"}
                  className="link"
                >
                  Logout
                </Link>
              )}
            </div>
          </MobileNavStyle>
        </>
      )}
    </>
  );
};

export default Header;
