import React from "react";
import styled from "styled-components";
import { useAppContext } from "../../context/useAppContext";

const CheckoutOrderSummaryStyle = styled.div`
  padding: 30px;
  border-radius: 11.25px;
  border: 0.75px solid #d9d9d9;
  background: #fff;
  .checkout__order__summary__item {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding-top: 20px;
    border-top: 0.75px solid rgba(48, 48, 48, 0.25);
    margin-top: 20px;
    &:first-child {
      margin-top: 35px;
      border-top: 0px;
      padding-top: 0px;
    }
  }
  .checkout__order__summary__title {
    color: #303030;
    font-size: 18px;
    font-weight: 600;
    line-height: 22.5px;
  }
  .checkout__order__summary__item__title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #303030;
    font-size: 15px;
    font-weight: 400;
    line-height: 22.5px;
    text-transform: capitalize;
    overflow: hidden;
    flex: 1;
    &.flex {
      display: flex;
      gap: 4px;
    }
  }
  .checkout__order__summary__item__quantity,
  .checkout__order__summary__item__totals {
    color: #303030;
    font-size: 15px;
    font-weight: 700;
    line-height: 22.5px;
    flex: 0 0 80px;
    text-align: right;
  }
  .checkout__order__summary__item__quantity {
    flex: 0 0 30px;
    text-align: center;
  }
  .checkout__order__summary__handler {
    margin-top: 10px;
    padding-top: 15px;
    border-top: 0.75px solid rgba(48, 48, 48, 0.25);
    margin-top: 35px;
    .checkout__order__summary__subtotals {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .checkout__items__total__title {
        color: #303030;
        font-size: 15px;
        line-height: 22px;
        font-weight: 400;
        &.bold {
          font-weight: 700;
        }
      }
    }
    .checkout__now__button {
      color: #fff;
      text-align: center;
      font-size: 15px;
      font-weight: 700;
      line-height: 23px;
      border-radius: 5px;
      width: 100%;
      height: 50px;
      background: #ae0000;
      margin-top: 20px;
      &:disabled {
        background: #a7a7a7;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 15px;
    .checkout__order__summary__title {
      font-size: 16px;
    }
    .checkout__order__summary__item__list {
      padding-top: 8px;
    }
    .checkout__order__summary__item {
      margin-top: 12px;
      gap: 24px;
    }
    .checkout__order__summary__item__title {
      font-size: 14px;
    }
    .checkout__order__summary__item__quantity,
    .checkout__order__summary__item__totals {
      font-size: 14px;
      font-weight: 600;
    }
    .checkout__order__summary__handler .checkout__now__button {
      width: 100%;
      font-size: 14px;
      height: 42px;
    }
  }
`;

const CheckoutOrderSummary = ({
  orderSummaryData,
  handleOrderNow,
  isCheckoutDisabled,
}) => {
  const { checkoutCartData, appliedCoupon } = useAppContext();

  return (
    <CheckoutOrderSummaryStyle>
      <h3 className="checkout__order__summary__title">Order Summary</h3>
      <div className="checkout__order__summary__item__list">
        {checkoutCartData?.items?.length &&
          checkoutCartData?.items?.map((item) => {
            if (item?.quantity > 0) {
              return (
                <div className="checkout__order__summary__item" key={item?._id}>
                  <p className="checkout__order__summary__item__title">
                    {item?.product?.name}
                  </p>
                  <h4 className="checkout__order__summary__item__quantity">
                    {item?.quantity}
                  </h4>
                  <h4 className="checkout__order__summary__item__totals">
                    {process.env.REACT_APP_PRICE_SYMBOL}
                    {(item?.product?.price - item?.product?.discount) *
                      item?.quantity}
                  </h4>
                </div>
              );
            }
            return;
          })}
      </div>
      <div className="checkout__order__summary__handler">
        <div className="checkout__order__summary__subtotals">
          <div className="checkout__items__total__title">Subtotal</div>
          <div className="checkout__order__summary__item__totals">
            {process.env.REACT_APP_PRICE_SYMBOL}
            {orderSummaryData?.subtotal}
          </div>
        </div>
        {orderSummaryData?.discountAmount > 0 && appliedCoupon && (
          <div className="checkout__order__summary__subtotals">
            <div className="checkout__items__total__title">
              Discount
              <span style={{ fontSize: "10px", color: "#4caf50" }}>
                ( {appliedCoupon} )
              </span>
            </div>
            <div
              className="checkout__order__summary__item__totals"
              style={{ color: "rgb(76, 175, 80)" }}
            >
              {process.env.REACT_APP_PRICE_SYMBOL}
              {orderSummaryData?.discountAmount}
            </div>
          </div>
        )}
        <div className="checkout__order__summary__subtotals">
          <div className="checkout__items__total__title">Shipping Fee</div>
          <div className="checkout__order__summary__item__totals">
            {process.env.REACT_APP_PRICE_SYMBOL}
            {orderSummaryData?.shippingCharges}
          </div>
        </div>
        <div className="checkout__order__summary__subtotals">
          <div className="checkout__items__total__title">Tax Amount</div>
          <div className="checkout__order__summary__item__totals">
            {process.env.REACT_APP_PRICE_SYMBOL}
            {orderSummaryData?.taxAmount}
          </div>
        </div>
        <div className="checkout__order__summary__subtotals">
          <div className="checkout__items__total__title bold">Total</div>
          <div className="checkout__order__summary__item__totals">
            {process.env.REACT_APP_PRICE_SYMBOL}
            {orderSummaryData?.totalAmount}
          </div>
        </div>
        <button
          className="checkout__now__button"
          disabled={isCheckoutDisabled}
          onClick={handleOrderNow}
        >
          Order Now
        </button>
      </div>
    </CheckoutOrderSummaryStyle>
  );
};

export default CheckoutOrderSummary;
