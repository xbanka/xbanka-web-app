// import Cookies from "js-cookie";

// const TOKEN_KEY = "accessToken";

// export const authToken = {
//   get() {
//     return Cookies.get(TOKEN_KEY);
//   },

//   set(token: string) {
//     Cookies.set(TOKEN_KEY, token, {
//       secure: true,
//       sameSite: "strict",
//     });
//   },

//   remove() {
//     Cookies.remove(TOKEN_KEY);
//   },
// };
// lib/auth/token.ts

export const authTokens = {
  getAccessToken: () => localStorage.getItem("accessToken"),

  getRefreshToken: () => localStorage.getItem("refreshToken"),

  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem("accessToken", accessToken);
    if(refreshToken){
      localStorage.setItem("refreshToken", refreshToken);
    }
  },

  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};