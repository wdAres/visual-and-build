import React from "react";
import styled from "styled-components";
import ProductCardSkeleton from "../skeleton/ProductCardSkeleton";
import StarRating from "../common/StarRating";

export const ProductCardStyle = styled.div`
  border-radius: 4px;
  border: 0.75px solid #d9d9d9;
  padding: 16px 15px 24px;
  width: 100%;
  cursor: pointer;
  .image {
    height: 168px;
    img {
      width: 100%;
      display: block;
      height: 100%;
      object-fit: cover;
    }
  }
  .content {
    display: flex;
    gap: 9px;
    flex-direction: column;
    margin-top: 9px;
    .product__tag {
      color: #898989;
      font-size: 10.5px;
      font-style: normal;
      font-weight: 400;
    }
    .product__title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-transform: capitalize;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      text-align: left;
    }
    .product__price__wrapper {
      display: flex;
      align-items: baseline;
      gap: 6px;
      flex-wrap: wrap;
      .product__discounted__price {
        color: #303030;
        font-size: 18px;
        font-weight: 600;
        line-height: 22.5px;
      }
      .product__price {
        color: #303030;
        font-size: 11.25px;
        font-weight: 400;
        line-height: 22.5px;
        text-decoration-line: line-through;
      }
    }
    .limited__discount__tag {
      font-size: 8px;
      padding: 4px 10px;
      background-color: #ae0000;
      color: #fff;
      display: inline-block;
      border-radius: 4px;
      margin-top: -4px;
      transform: translateY(-4px);
    }
  }
  @media (max-width: 768px) {
    padding: 10px;
    .content {
      .product__price__wrapper {
        row-gap: 0px;
        column-gap: 6px;
      }
    }
  }
`;

const ProductCard = ({
  productImage,
  productTag,
  productTitle,
  productDiscountedPrice,
  productPrice,
  isLoading,
  onClick,
  avgRating,
  ratingCount,
}) => {
  const priceSymbol = process.env.REACT_APP_PRICE_SYMBOL;
  return (
    <>
      {!isLoading ? (
        <ProductCardStyle onClick={onClick}>
          <div className="image">
            <img src={productImage} alt="" />
          </div>
          <div className="content">
            <p className="product__tag">{productTag}</p>
            <p className="product__title" title={productTitle}>
              {productTitle}
            </p>
            <div className="product__reviews">
              <StarRating
                avgRating={avgRating?.toFixed(1)}
                ratingCount={ratingCount}
              />
            </div>
            <div className="product__price__wrapper">
              <div className="product__discounted__price">
                {priceSymbol + productDiscountedPrice}
              </div>
              {productPrice && (
                <div className="product__price">
                  {priceSymbol + productPrice}
                </div>
              )}
            </div>
            {productPrice && (
              <div>
                <div className="limited__discount__tag">Limited</div>
              </div>
            )}
          </div>
        </ProductCardStyle>
      ) : (
        <ProductCardSkeleton />
      )}
    </>
  );
};

export default ProductCard;
