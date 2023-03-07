import axios from "axios";

async function userLogout(headers) {
  const {data} = await axios({
    headers,
    method: "POST",
    url: "api/users/logout",
  });

  localStorage.removeItem("loggedUser");

  return {
    headers: null,
    isAuth: false,
    loggedUser: {
      bio: null,
      email: "",
      image: null,
      token: "",
      username: "",
    },
  };
}

export default userLogout;
