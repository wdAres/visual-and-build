import axios from "axios";
import { useState } from "react";
const baseUrl = process.env.REACT_APP_SERVER_URL;
// const baseUrl = 'https://vnb.onrender.com/api';


export const useRequest = (path, method = "get", rawResponse = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(null);
  const [error, setError] = useState("");
  
  const runRequest = async ({
    body,
    path: requestPath,
    method: requestMethod,
    params,
  } = {}) => {
    setError("");
    setState(null);
    setIsLoading(true);
    const theMethod = requestMethod || method;
    const url = `${baseUrl}${requestPath || path}`;

    return new Promise(async (resolve, reject) => {
      try {
        const { token } = JSON.parse(localStorage.getItem("user")) || {
          token: "",
        };
        const res = await axios({
          method: theMethod,
          url,
          data: body,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          params,
        });
        setState(res.data);
        resolve(res.data);
      } catch (error) {
        const { response, message } = error;
        console.log(`error.response`, response);

        let resError;
        if (typeof response?.data === "object")
          resError =
            response.data.validation ||
            response.data.error ||
            response.data.message;
        else resError = message;

        setError(resError);
        reject(rawResponse ? response : resError);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    });
  };
  return [runRequest, { isLoading, state, setState, error, setError }];
};
