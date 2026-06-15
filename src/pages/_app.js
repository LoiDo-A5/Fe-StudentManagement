import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { setAxiosDefaultAuthToken, theme } from "../utils/utils";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyApp = ({ Component, pageProps }) => {

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      setAxiosDefaultAuthToken(accessToken, refreshToken);
    }
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
