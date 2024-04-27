import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ProductList from "../../components/product/ProductList";
import { useAppContext } from "../../context/useAppContext";
import { useRequest } from "../../hooks/useRequest";
import CategoryList from "../../components/category/CategoryList";
import SlidingBanner from "../../components/common/SlidingBanner";
import { Skeleton } from "@mui/material";

const VendorStyle = styled.div`
  .vendor__logo {
    width: 185px;
    height: 185px;
    transform: translateY(-50%);
    border-radius: 14px;
    border: 0.75px solid #969696;
    background: #fff;
    overflow: clip;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .vendor__cover {
    height: 350px;
    img {
      object-fit: cover;
    }
  }
  .seller__categories {
    padding: 0 0 80px;
    .list_wrapper {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
    }
  }
  .products__list {
    padding: 60px 0;
  }

  .grid_heading{
    color: #303030;
    font-size: 27px;
    font-style: normal;
    font-weight: 600;
    line-height: 34.5px;
  }

  .grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
    padding:50px 0;
  }
  .grid_card{
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #ae0000;
    grid-column: span 1 ;
  }
  .grid_card h5{
    margin-bottom: 14px;
    font-size: 15px;
    font-weight: 600;
    color: #ae0000;

  }
  .grid_card p{
  }
  @media (max-width: 768px) {
    .vendor__cover {
      margin-top: 0;
      height: 150px;
      img {
        object-fit: cover;
      }
    }
    .vendor__logo {
      width: 80px;
      height: 80px;
    }
    .seller__categories {
      .list_wrapper {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
    }
    .products__list {
      padding: 30px 0;
      .product__list__wrapper {
        padding-left: 0;
      }
    }
  }
`;

const Vendor = () => {
  const { sellerId } = useParams();
  const { isDesktop } = useAppContext();
  const [fetchSellerDetails, { isLoading: isFetchingSellerDetails }] =
    useRequest();
  const [sellerData, setSellerData] = useState();
  const { shopLogo, vendorName, topBanner, sliderBannersUrl , shopAddress , shopPhone , pickupAddress , pickupPoint } =
    sellerData || {};
  const [
    fetchCategories,
    { isLoading: isFetchingCategories, state: category },
  ] = useRequest(`/seller/${sellerId}/categories`);

  useEffect(() => {
    const fetchSellerInfo = async (sellerId) => {
      const paths = [
        `/seller/${sellerId}/show`,
        `/seller/${sellerId}/products`,
      ];
      const results = await Promise.all(
        paths?.map((path) => fetchSellerDetails({ path }))
      );
      setSellerData(results[0]?.data);
      console.log(results);
    };
    fetchSellerInfo(sellerId);
  }, [sellerId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <VendorStyle>
      <div className="vendor__cover">
        {isFetchingSellerDetails ? (
          <Skeleton width={"100%"} height={400} variant="rectangular" />
        ) : (
          <img
            className="w-100"
            src={process.env.REACT_APP_MEDIA_ASSETS_URL + "/" + topBanner}
            alt={vendorName}
          />
        )}
      </div>
      <div className="container">
        <div className="vendor__logo">
          <img
            className="w-100"
            src={process.env.REACT_APP_MEDIA_ASSETS_URL + "/" + shopLogo}
            alt={vendorName}
          />
        </div>
        <div className="seller__categories">
          <CategoryList
            title={"Shop by Categories"}
            list={category?.data}
            loading={isFetchingCategories}
            type={"text-in-image"}
          />
        </div>
        <div>
          <div className="title_wrapper">
            <h2 className="title grid_heading">Seller Details</h2>
          </div>
          <div className="grid">
              <div className='grid_card'>
                <h5>Shop Address</h5>
                <p>
                  {shopAddress}
                </p>
              </div>
              <div className='grid_card'>
                <h5>Shop Phone</h5>
                <p>
                  {shopPhone}
                </p>
              </div>
              <div className='grid_card'>
                <h5>Pickup Address</h5>
                <p>
                  {pickupAddress?.address}
                </p>
              </div>
          </div>
        </div>
      </div>
      <div>
        {sliderBannersUrl?.length > 0 && (
          <SlidingBanner
            bannerData={sliderBannersUrl}
            leftdistance={isDesktop ? 108 : 30}
            loading={isFetchingSellerDetails}
          />
        )}
      </div>
      <div className="container products__list">
        <ProductList apiPath={`/seller/${sellerId}/products`} />
      </div>
    </VendorStyle>
  );
};

export default Vendor;
