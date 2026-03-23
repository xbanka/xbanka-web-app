import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";

export const authToken = {
  get() {
    return Cookies.get(TOKEN_KEY);
  },

  set(token: string) {
    Cookies.set(TOKEN_KEY, token, {
      secure: true,
      sameSite: "strict",
    });
  },

  remove() {
    Cookies.remove(TOKEN_KEY);
  },
};