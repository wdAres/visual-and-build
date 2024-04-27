import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { useRequest } from "../../hooks/useRequest";
import Slider from "@mui/material/Slider";
import { GoChevronDown } from "react-icons/go";

const FilterStyle = styled.div`
  .filter__wrapper {
    padding: 27px;
  }
  .title_flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title_enable {
    color: #ae0000;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
  }
  .search__input {
    background-color: #fff;
    width: 100%;
    height: 36px;
    border: 0.75px solid #d9d9d9;
    display: block;
    border-radius: 4px;
    padding: 4px 8px;
    &::placeholder {
      color: #b1b1b1;
      font-size: 12px;
    }
  }
  .filter__title {
    font-size: 15px;
    font-weight: 700;
    line-height: 24px;
    margin-bottom: 14px;
  }
  .input__dropdown__wrapper {
    position: relative;
    .dropdown {
      border-radius: 4px;
      border: 0.75px solid #d9d9d9;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #fff;
      z-index: 9;
      height: 150px;
      overflow: auto;
      box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.1);
      .filter__group {
        border: 0.75px solid #d9d9d9;
        margin: 0;
        padding: 10px;
        border-radius: 0px;
      }
      .not__found {
        label {
          font-size: 14px;
          text-align: center;
          padding: 12px;
          display: block;
        }
      }
    }
  }
  .filter__group {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px 0;
    input {
      cursor: pointer;
      &:selected {
        + label {
          font-weight: 700;
        }
        + .label {
          font-weight: 700;
        }
      }
    }
    label,
    .label {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      text-transform: capitalize;
      cursor: pointer;
      flex: 1;
    }
    .checkbox {
      accent-color: #ae0000;
    }
  }
  .range__slider {
    .MuiSlider-rail {
      background-color: rgba(48, 48, 48, 0.25);
    }
    .MuiSlider-thumb,
    .MuiSlider-track {
      background-color: #ae0000;
    }
    .MuiSlider-track {
      border: 1px solid #ae0000;
    }
  }
  .slider__input__wrapper {
    display: flex;
    justify-content: space-between;
    .slider__input {
      border: 1px solid #d9d9d9;
      max-width: 60px;
      height: 32px;
      padding: 6px;
    }
  }
`;

const FilterDropdownStyle = styled.div`
  &.active {
    .dropdown {
      display: block;
    }
    .label {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
  .dropdown {
    padding-left: 20px;
    display: none;
  }
  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      font-size: 16px;
    }
  }
`;

function valuetext(value) {
  return `Rs. ${value}`;
}

const Filters = ({
  categoriesData,
  brandsData,
  searchInput,
  setSearchInput,
  priceRange = [1000, 6500],
  setPriceRange,
  locationRange = [5, 15],
  setLocationRange,
  setLatLong,
}) => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const categoryNames = params.getAll("categories[]");
  const brandNames = params.getAll("brands[]");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [fetchSearch] = useRequest();
  const [priceValue, setPriceValue] = useState(priceRange);
  const [locationValue, setLocationValue] = useState(locationRange);
  const [userLocation, setUserLocation] = useState(null);

  useDebounce(
    () => {
      setPriceRange(priceValue);
      setLocationRange(locationValue);
      setLatLong(userLocation);
    },
    [priceValue, locationValue, userLocation],
    300
  );

  useDebounce(
    async () => {
      if (searchInput?.type && searchInput?.value) {
        let endpoint = "";
        let setterFunction = null;

        if (searchInput.type === "category") {
          endpoint = `/category?limit=10&page=1&search=${searchInput.value}`;
          setterFunction = setCategories;
        } else if (searchInput.type === "brand") {
          endpoint = `/brand?limit=10&page=1&search=${searchInput.value}`;
          setterFunction = setBrands;
        }

        if (endpoint && setterFunction) {
          const response = await fetchSearch({ path: endpoint });
          setterFunction(response?.data?.docs);
        }
      }
    },
    [searchInput],
    300
  );

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const searchParams = new URLSearchParams(search);
    if (name === "categories") {
      if (checked) {
        searchParams.append("categories[]", value);
      } else {
        searchParams.delete("categories[]");
        categoryNames
          .filter((name) => name !== value)
          .forEach((item) => searchParams.append("categories[]", item));
      }
    } else if (name === "brands") {
      if (checked) {
        searchParams.append("brands[]", value);
      } else {
        searchParams.delete("brands[]");
        brandNames
          .filter((name) => name !== value)
          .forEach((item) => searchParams.append("brands[]", item));
      }
    }
    const newUrl = `${pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  };

  const handleMaskClick = (value) => {
    setSearchInput((prev) => ({ ...prev, value: "" }));
    if (value === "brands") {
      setBrands([]);
    }
    if (value === "category") {
      setCategories([]);
    }
  };

  const handleSliderChange = (event, newValue) => {
    if (event?.target?.name === "price") {
      setPriceValue(newValue);
    }
    if (event?.target?.name === "location") {
      setLocationValue(newValue);
    }
  };

  const toggleVisibility = (event) => {
    const parentElement = event.target.parentNode.parentNode;
    if (parentElement) {
      parentElement.classList.toggle("active");
    }
  };
  const enableLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "Location access is denied. Please enable location access in your browser settings."
            );
          } else {
            alert("Error getting location:", error);
          }
        }
      );
    } else {
      alert("Geolocation is not supported in this browser.");
    }
  };

  const handleLoc = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({
            latitude,
            longitude,
          });
        },
        (error) => {
          console.log(false);
        }
      );
    }
  };

  useEffect(() => {
    handleLoc();
  }, []);


  return (
    <FilterStyle>
      <div className="filter__wrapper">
        <h3 className="filter__title">Categories</h3>
        <div className="input__dropdown__wrapper">
          <input
            type="search"
            className="search__input"
            placeholder="Search categories"
            value={searchInput?.type === "category" ? searchInput?.value : ""}
            onChange={(e) =>
              setSearchInput({
                type: "category",
                value: e?.target?.value,
              })
            }
          />
          {searchInput?.type === "category" &&
            searchInput?.value &&
            categories?.length > 0 && (
              <>
                <div
                  style={{ position: "fixed", inset: 0 }}
                  onClick={() => handleMaskClick("category")}
                />
                <div className="dropdown">
                  {categories?.length > 0 ? (
                    categories?.map((item) => (
                      <div className="filter__group" key={item?._id}>
                        <input
                          type="checkbox"
                          name="categories"
                          className="checkbox"
                          id={`category${item?._id}`}
                          value={item?._id}
                          checked={categoryNames?.includes(item?._id)}
                          onChange={handleChange}
                        />
                        <label htmlFor={`category${item?._id}`}>
                          {item?.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="not__found">
                      <label>No category found.</label>
                    </div>
                  )}
                </div>
              </>
            )}
        </div>


        {/* {categoriesData?.map((item) => (
          <FilterDropdownStyle className="filter__wrap">
            <div className="filter__group" key={item?._id}>
              <input
                type="checkbox"
                name="categories"
                className="checkbox"
                id={`category${item?._id}`}
                value={item?._id}
                checked={categoryNames?.includes(item?._id)}
                onChange={handleChange}
              />
              {!item?.children?.length ? (
                <label className="label" htmlFor={`category${item?._id}`}>
                  {item?.name}
                </label>
              ) : (
                <div className="label" onClick={toggleVisibility}>
                  {item?.name} <GoChevronDown className="icon" />
                </div>
              )}
            </div>
            <div className="dropdown">
              {item?.children?.length > 0 &&
                item?.children?.map((child) => (
                  <div className="filter__group" key={child?._id}>
                    <input
                      type="checkbox"
                      name="categories"
                      className="checkbox"
                      id={`category${child?._id}`}
                      value={child?._id}
                      checked={categoryNames?.includes(child?._id)}
                      onChange={handleChange}
                    />
                    <label className="label" htmlFor={`category${child?._id}`}>
                      {child?.name}
                    </label>
                  </div>
                ))}
            </div>
          </FilterDropdownStyle>
        ))} */}
        

        {categoriesData?.map((item) => (
  <FilterDropdownStyle className="filter__wrap" key={item?._id}>
    <div className="filter__group" key={item?._id}>
      <input
        type="checkbox"
        name="categories"
        className="checkbox"
        id={`category${item?._id}`}
        value={item?._id}
        checked={categoryNames?.includes(item?._id)}
        onChange={handleChange}
      />
      {!item?.children?.length ? (
        <label className="label" htmlFor={`category${item?._id}`}>
          {item?.name}
        </label>
      ) : (
        <div className="label" onClick={toggleVisibility}>
          {item?.name} <GoChevronDown className="icon" />
        </div>
      )}
    </div>
    {/* Render children */}
    {item?.children?.length > 0 && (
      <div className="dropdown">
        {item?.children?.map((child) => (
          <div className="filter__group" key={child?._id}>
            <input
              type="checkbox"
              name="categories"
              className="checkbox"
              id={`category${child?._id}`}
              value={child?._id}
              checked={categoryNames?.includes(child?._id)}
              onChange={handleChange}
            />
            <label className="label" htmlFor={`category${child?._id}`}>
              {child?.name}
            </label>
            {/* Render grandchildren */}
            {child?.children?.length > 0 && (
              <div className="dropdown">
                {child?.children?.map((grandchild) => (
                  <div className="filter__group" key={grandchild?._id}>
                    <input
                      type="checkbox"
                      name="categories"
                      className="checkbox"
                      id={`category${grandchild?._id}`}
                      value={grandchild?._id}
                      checked={categoryNames?.includes(grandchild?._id)}
                      onChange={handleChange}
                    />
                    <label className="label" htmlFor={`category${grandchild?._id}`}>
                      {grandchild?.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </FilterDropdownStyle>
))}



      </div>
      <hr
        style={{
          border: 0,
          borderBottom: "0.75px solid rgb(48 48 48 / 25%)",
          margin: "0 27px",
        }}
      />
      <div className="filter__wrapper">
        <h3 className="filter__title">Brands</h3>
        <div className="input__dropdown__wrapper">
          <input
            type="search"
            className="search__input"
            placeholder="Search brands"
            value={searchInput?.type === "brand" ? searchInput?.value : ""}
            onChange={(e) => {
              setSearchInput({
                type: "brand",
                value: e?.target?.value,
              });
            }}
          />
          {searchInput?.type === "brand" &&
            searchInput?.value &&
            brands?.length > 0 && (
              <>
                <div
                  style={{ position: "fixed", inset: 0 }}
                  onClick={() => handleMaskClick("brands")}
                />
                <div className="dropdown">
                  {brands?.length > 0 ? (
                    brands?.map((item) => (
                      <div className="filter__group" key={item?._id}>
                        <input
                          type="checkbox"
                          name="brands"
                          className="checkbox"
                          id={`brand${item?._id}`}
                          value={item?._id}
                          checked={brandNames?.includes(item?._id)}
                          onChange={handleChange}
                        />
                        <label htmlFor={`category${item?._id}`}>
                          {item?.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="not__found">
                      <label>No category found.</label>
                    </div>
                  )}
                </div>
              </>
            )}
        </div>
        {brandsData?.map((item) => (
          <div className="filter__group" key={item?._id}>
            <input
              type="checkbox"
              name="brands"
              className="checkbox"
              value={item?._id}
              id={`brand${item?._id}`}
              checked={brandNames?.includes(item?._id)}
              onChange={handleChange}
            />
            <label htmlFor={`brand${item?._id}`}>{item?.name}</label>
          </div>
        ))}
      </div>
      <hr
        style={{
          border: 0,
          borderBottom: "0.75px solid rgb(48 48 48 / 25%)",
          margin: "0 27px",
        }}
      />
      <div className="filter__wrapper">
        <h3 className="filter__title">Price Range</h3>

        <Slider
          getAriaLabel={() => "Price Range"}
          value={priceValue}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          className="range__slider"
          min={1000}
          step={100}
          max={8000}
          name={"price"}
        />
        <div className="slider__input__wrapper">
          <input
            type="number"
            value={priceValue?.[0]}
            className="slider__input"
            max={8000}
            onChange={(e) => {
              const newPriceValue = [...priceValue];
              newPriceValue[0] = Number(e.target.value);
              if (newPriceValue[0] >= newPriceValue[1]) {
                newPriceValue[0] = newPriceValue[1];
              }
              setPriceValue(newPriceValue);
            }}
          />
          <input
            type="number"
            value={priceValue?.[1]}
            className="slider__input"
            max={8000}
            onChange={(e) => {
              const newPriceValue = [...priceValue];
              newPriceValue[1] = e.target.value;
              setPriceValue(newPriceValue);
            }}
          />
        </div>
      </div>
      {/* userLocation && */}
      {/* { Object.keys(userLocation)?.length > 0 && ( */}
      <div className="filter__wrapper">
        <h3 className="filter__title title_flex">
          Location{" "}
          {!userLocation && (
            <span onClick={enableLocation} className="title_enable">
              Enable
            </span>
          )}
        </h3>

        <Slider
          disabled={!userLocation}
          getAriaLabel={() => "Location"}
          value={locationValue}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          className="range__slider"
          min={5}
          step={1}
          max={25}
          name={"location"}
        />
        <div className="slider__input__wrapper">
          <div style={{ position: "relative" }}>
            <input
              type="number"
              disabled={!userLocation}
              value={locationValue?.[0]}
              className="slider__input"
              max={5}
              onChange={(e) => {
                const newLocationValue = [...locationValue];
                newLocationValue[0] = Number(e.target.value);
                if (newLocationValue[0] >= newLocationValue[1]) {
                  newLocationValue[0] = newLocationValue[1];
                }
                setLocationValue(newLocationValue);
              }}
              style={{ paddingRight: "25px" }}
            />
            <span
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
              }}
            >
              km
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              value={locationValue?.[1]}
              disabled={!userLocation}
              className="slider__input"
              max={25}
              onChange={(e) => {
                const newLocationValue = [...locationValue];
                newLocationValue[1] = e.target.value;
                setLocationValue(newLocationValue);
              }}
              style={{ paddingRight: "25px" }}
            />
            <span
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
              }}
            >
              km
            </span>
          </div>
        </div>
      </div>
      {/* )} */}
    </FilterStyle>
  );
};

export default Filters;
