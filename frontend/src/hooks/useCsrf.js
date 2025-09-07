import { useEffect } from "react";
import axios, { getCsrfToken } from "../api/api";
import Cookie from "js-cookie";

export function useCsrf() {
  useEffect(() => {
    getCsrfToken().then(() => {
      const token = Cookie.get("XSRF-TOKEN");
      axios.defaults.headers.common["X-XSRF-TOKEN"] = token;
    }).catch(err => {
      console.error("CSRF setup failed:", err);
    });
  }, []);
}
