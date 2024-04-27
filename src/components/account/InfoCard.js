import React from "react";
import styled from "styled-components";

const InfoCardStyle = styled.div`
  border: 0.75px solid #000;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 230px;
  .info__main__detils {
    padding: 18px 18px 9px;
  }
  .info__main__title {
    color: #000;
    font-size: 18px;
    font-weight: 700;
    line-height: 22.5px;
    margin-bottom: 17.5px;
    text-transform: capitalize;
  }
  .info__main__subtitle {
    color: #000;
    font-size: 13.5px;
    font-weight: 700;
    line-height: 20.25px;
    margin-bottom: 8.25px;
  }
  .info__main__sub {
    color: #666;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    margin-bottom: 9px;
  }
  .info__main__button {
    padding: 18px;
    button {
      color: #ae0000;
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      width: 100%;
      height: 36px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      border: 1.5px solid #ae0000;
      transition: all 0.3s;
      &:hover {
        background-color: #ae0000;
        color: #fff;
      }
    }
  }
`;

const InfoCard = ({
  title,
  subtitle,
  sub1,
  sub2,
  sub3,
  buttonText,
  onClick,
}) => {


  return (
    <InfoCardStyle>
      <div className="info__main__detils">
        <div className="info__main__title">{title}</div>
        {subtitle && <div className="info__main__subtitle">{subtitle}</div>}
        {sub1 && <div className="info__main__sub">{sub1}</div>}
        {sub2 && <div className="info__main__sub">{sub2}</div>}
        {sub3 && <div className="info__main__sub">{sub3}</div>}
      </div>
      <div className="info__main__button">
        <button onClick={onClick}>{buttonText}</button>
      </div>
    </InfoCardStyle>
  );
};

export default InfoCard;
