import axios from "axios";

import { ToastTopHelper } from "../utils";
import { reactLocalStorage } from "reactjs-localstorage";
import API from "@/configs/API";

let isShowingToastify = false;
let messageTemp;

const parseErrorResponse = (error) => {
  let message;
  let data = {};

  if (
    error.response &&
    error.response.data &&
    error.response.data instanceof Object
  ) {
    data = error.response.data;
    const firstKey = Object.keys(error.response.data)[0];
    message = error.response.data[firstKey];
    const valueOfFirstKey = message;

    if (message instanceof Array) {
      message = message[0];
    }

    message = `${firstKey}: ${message}`;

    if (firstKey !== "" && error.response.data) {
      if (Object.keys(error.response.data)?.length === 1) {
        const existMessage = !!valueOfFirstKey["message"];
        if (existMessage) {
          message = valueOfFirstKey["message"];
        }
        if (valueOfFirstKey instanceof Array) {
          message = valueOfFirstKey[0];
        }
        if (typeof valueOfFirstKey === "string") {
          message = valueOfFirstKey;
        }
      }
    }
  } else {
    message = error.message;
  }

  if (process.env.NODE_ENV !== "production") {
    ToastTopHelper.error(message);
  } else {
    if (
      (!isShowingToastify || messageTemp !== message) &&
      message !== "Request failed with status code 404"
    ) {
      messageTemp = message;
      isShowingToastify = true;
      ToastTopHelper.error(message);
      const to = setTimeout(() => {
        isShowingToastify = false;
        clearTimeout(to);
      }, 5000);
    }
  }

  return {
    success: false,
    error,
    message,
    data,
  };
};

async function refreshToken() {
  const refreshToken = reactLocalStorage.get("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    API.AUTH.TOKEN_REFRESH,
    {
      refresh: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function axiosCall(method, ...args) {
  let response;
  let handleError = true;
  if (typeof args[0] === "boolean" && args[0] === false) {
    handleError = false;
    args.shift();
  }

  try {
    response = await axios[method](...args);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const { access, refresh } = await refreshToken();
        reactLocalStorage.set("accessToken", access);
        if (refresh) {
          reactLocalStorage.set("refreshToken", refresh);
        }
        axios.defaults.headers["Authorization"] = `Bearer ${access}`;
        response = await axios[method](...args);
      } catch (refreshError) {
        reactLocalStorage.clear();
        ToastTopHelper.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      }
    } else {
      if (!handleError) {
        return { success: false, error, data: error?.response?.data };
      }
      return parseErrorResponse(error);
    }
  }

  if (!response || !response.data) {
    return { success: false, error: "No data received from the server" };
  }

  const { data } = response;

  return {
    success: true,
    data,
  };
}

export async function axiosPost(...options) {
  return await axiosCall("post", ...options);
}

export async function axiosGet(...options) {
  return await axiosCall("get", ...options);
}

export async function axiosPut(...options) {
  return await axiosCall("put", ...options);
}

export async function axiosPatch(...options) {
  return await axiosCall("patch", ...options);
}

export async function axiosDelete(...options) {
  return await axiosCall("delete", ...options);
}
