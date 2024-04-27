import React, { useEffect } from "react";
import styled from "styled-components";
import InfoCard from "../../components/account/InfoCard";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../../hooks/useRequest";
import { Skeleton } from "@mui/material";

const AccountStyle = styled.div`
  width: 100%;
  .page__title {
    color: #000;
    font-size: 27px;
    font-weight: 700;
    line-height: 34px;
    margin-bottom: 24px;
  }
  .account__info__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 24px;
    row-gap: 32px;
  }
  @media (max-width: 786px) {
    .page__title {
      font-size: 24px;
    }
    .account__info__grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

const Account = () => {
  const navigate = useNavigate();
  const [
    fetchAccount,
    { isLoading: isFetchingAccountData, state: accountState },
  ] = useRequest();

  const accountData = [
    {
      title: `Hi ${accountState?.data?.name}`,
      subtitle:
        accountState?.data?.vbId && `V&B ID: ${accountState?.data?.vbId}`,
      sub1: accountState?.data?.businessName,
      sub2: accountState?.data?.email,
      sub3: accountState?.data?.phone,
      buttonText: `Edit Profile Information`,
      onClick: () => {
        navigate("/account/profile-information");
      },
    },
    {
      title: `Purchase History`,
      sub1: `Add receipts and keep track of your online and in-store purchases.`,
      buttonText: `View Purchase History`,
      onClick: () => {
        navigate("/account/purchase-history");
      },
    },
    {
      title: `My List`,
      sub1: `You have not saved any products yet.`,
      buttonText: `View My List`,
      onClick: () => {
        navigate("/account/lists");
      },
    },
    {
      title: `My Addresses`,
      sub1: `Add and manage your addresses like shipping`,
      buttonText: `View My Address`,
      onClick: () => {
        navigate("/account/address");
      },
    },
    {
      title: `Help And Support`,
      sub1: `Need help related to orders`,
      buttonText: `Contact Support`,
      onClick: () => {
        navigate("/account/help-support");
      },
    },
    {
      title: `Tickets`,
      sub1: `View all of your raised tickets here`,
      buttonText: `View Tickets`,
      onClick: () => {
        navigate("/account/tickets");
      },
    },
  ];

  useEffect(() => {
    async function fetchAccountDetails() {
      const path = `/account`;
      await fetchAccount({ path });
    }
    fetchAccountDetails();

    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountStyle>
      <div className="container">
        <div className="page__title">My Account</div>
        <div className="account__info__grid">
          {!isFetchingAccountData ? (
            <>
              {accountData?.map((data) => (
                <InfoCard key={data?._id} {...data} />
              ))}
            </>
          ) : (
            Array.from({ length: 6 }, (_, index) => (
              <Skeleton
                variant="rectangle"
                key={index + 1}
                height={200}
                width={"100%"}
              />
            ))
          )}
        </div>
      </div>
    </AccountStyle>
  );
};

export default Account;
