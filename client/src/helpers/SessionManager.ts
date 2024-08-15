import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import validator from "validator";

export namespace SessionManager {
  export class SessionManager {
    private cookies: any;
    setup() {
      var [cookies, setCookies, removeCookie] = useCookies();
      this.cookies = cookies;
      var navigate = useNavigate();
      return { cookies, setCookies, removeCookie, navigate };
    }
    isSigned(callback: any) {
      var AUTH = this.cookies["AUTH_TOKEN"];
      if (AUTH && !validator.isEmpty(AUTH)) {
        callback(true);
      } else {
        callback(false);
      }
    }
  }
}
