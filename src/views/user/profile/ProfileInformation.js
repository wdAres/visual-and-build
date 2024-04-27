import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../../components/common/Button";
import { useRequest } from "../../../hooks/useRequest";
import { toast } from "react-toastify";
import Progress from "../../../components/common/Progress";

const ProfileInformationStyle = styled.div`
  .text {
    color: #333;
    font-size: 11.25px;
    font-weight: 400;
    line-height: 18px;
    margin-bottom: 12px;
  }
  .input__wrapper {
    margin-bottom: 11.75px;
    display: flex;
    gap: 12px;
  }
  label {
    color: #333;
    font-size: 10px;
    font-weight: 400;
    line-height: 16px;
  }
  input,
  .divselect {
    border-radius: 1.5px;
    border: 0.75px solid #666;
    background: #fff;
    width: 100%;
    height: 32px;
    padding: 6.5px;
    color: #333;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
  }
  select {
    border: 0px;
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    &:focus {
      outline: none;
    }
  }
  .input_group {
    max-width: 370px;
    width: 100%;
  }
  .page__subtitle {
    color: #333;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    margin-bottom: 18px;
    margin-top: 42px;
  }
`;

const ProfileInformation = () => {
  const [updateProfileInformation, { isLoading }] = useRequest();
  const [fetchAccount, { state: accountState }] = useRequest(`/account`);
  const [profileInformation, setProfileInformation] = useState({
    name: "",
    email: "",
    password: "",
    current_password:"",
    phone: "",
    businessName: "",
    businessPhone: "",
    businessAltPhone: "",
    businessAddress: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const input = value.replace(/\D/g, "");
      const truncatedInput = input.slice(0, 11);
      return setProfileInformation((prev) => ({
        ...prev,
        [name]: truncatedInput,
      }));
    }
    setProfileInformation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const body = Object.keys(profileInformation).reduce((acc, key) => {
      if (profileInformation[key] !== "") {
        acc[key] = profileInformation[key];
      }
      return acc;
    }, {});
    const response = await updateProfileInformation({
      path: `/account`,
      method: "PUT",
      body,
    });
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    fetchAccount().then((data) => {
      setProfileInformation({
        name: data?.data?.name,
        email: data?.data?.email,
        current_password:"",
        password: "",
        phone: data?.data?.phone,
        businessName: data?.data?.businessName,
        businessPhone: data?.data?.businessPhone,
        businessAltPhone: data?.data?.businessAltPhone,
        businessAddress: data?.data?.businessAddress,
        city: data?.data?.city,
        province: data?.data?.province,
        postalCode: data?.data?.ppostalCode,
      });
    });
  }, []);

  return (
    <>
      <ProfileInformationStyle>
        <div className="form__info__wrapper">
          <p className="text">
            Update your name, email and password to keep your account details up
            to date.
          </p>
          <div className="input__wrapper">
            <div className="input_group">
              <label className="required">Full name</label>
              <input
                type="text"
                name="name"
                value={profileInformation?.name}
                onChange={handleChange}
              />
            </div>
            {/* <div className="input_group">
            <label className="required">Last name</label>
            <input
              type="text"
              name="lastName"
              value={profileInformation?.lastName}
              onChange={handleChange}
            />
          </div> */}
          </div>
          <Button type={"save"} onClick={handleSave} title={"Save Changes"} />
          <div className="page__subtitle">Business Details</div>
          <p className="text">
            Your Home Depot rewards will be sent to your registered business
            address.
          </p>
          <div className="input__wrapper">
            <div className="input_group">
              <label>Business Name</label>
              <input
                type="text"
                name="businessName"
                value={profileInformation?.businessName}
                onChange={handleChange}
              />
            </div>
            <div className="input_group"></div>
          </div>
          <div className="input__wrapper">
            <div className="input_group">
              <label>Primary Business Phone</label>
              <input
                type="text"
                name="businessPhone"
                value={profileInformation?.businessPhone}
                onChange={handleChange}
              />
            </div>
            <div className="input_group">
              <label>Secondary Business Phone (Optional)</label>
              <input
                type="text"
                name="businessAltPhone"
                value={profileInformation?.businessAltPhone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input__wrapper">
            <div className="input_group">
              <label>Business Address</label>
              <input
                type="text"
                name="businessAddress"
                value={profileInformation?.businessAddress}
                onChange={handleChange}
              />
            </div>
            <div className="input_group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={profileInformation?.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input__wrapper">
            <div className="input_group">
              <label>Province</label>
              {/* <div className="divselect">
                <select>
                  <option>India</option>
                  <option>British Columbia </option>
                </select>
              </div> */}
              <input
                type="text"
                name="province"
                value={profileInformation?.province}
                onChange={handleChange}
              />
            </div>
            <div className="input_group">
              <label>Postal Code – A0A 0A0</label>
              <input
                type="text"
                name="postalCode"
                value={profileInformation?.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className="input__wrapper">
            <div className="input_group">
              <label>Business or Trade</label>
              <div className="divselect">
                <select>
                  <option>India</option>
                  <option>British Columbia </option>
                </select>
              </div>
            </div>
            <div className="input_group"></div>
          </div> */}
          <Button type={"save"} title={"Save Changes"} onClick={handleSave} />
          <div className="page__subtitle">Update Email</div>
          <p className="text">
            After saving your new email, you will be signed out and prompted to
            sign in with your new email ID.
          </p>
          <div className="input__wrapper">
            <div className="input_group">
              <label className="required">Email</label>
              <input
                type="email"
                name="email"
                value={profileInformation?.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button type={"save"} onClick={handleSave} title={"Save Changes"} />

          <div className="page__subtitle">Update Password</div>
          <div className="input__wrapper">
            <div className="input_group">
            <label className="required">Current Password</label>
            <input  name="current_password" type="password" value={profileInformation?.current_password}
                onChange={handleChange} />
          </div>
            <div className="input_group">
              <label className="required">New Password</label>
              <input
                type="password"
                name="password"
                value={profileInformation?.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type={"save"} onClick={handleSave} title={"Save Changes"} />

          <div className="page__subtitle">Update Phone Number</div>
          <div className="input__wrapper">
            {/* <div className="input_group">
            <label className="required">Current Password</label>
            <input type="password" />
          </div> */}
            <div className="input_group">
              <label className="required">Phone Number</label>
              <input
                type="number"
                pattern="\d*"
                max={11}
                name="phone"
                value={profileInformation?.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type={"save"} onClick={handleSave} title={"Save Changes"} />
        </div>
      </ProfileInformationStyle>
      {isLoading && <Progress />}
    </>
  );
};

export default ProfileInformation;
