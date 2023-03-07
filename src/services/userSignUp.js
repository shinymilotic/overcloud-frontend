import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function userSignUp({ username, email, password }) {
  try {
    const requestData = {
      data: { user: { username, email, password } },
      method: "POST",
      url: "api/users",
    };

    const { data } = await axios(requestData);

    const { user } = data;
    const headers = { Authorization: `Bearer ${user.token}` };

    const loggedIn = { headers, isAuth: true, loggedUser: user };

    localStorage.setItem("loggedUser", JSON.stringify(loggedIn));

    return loggedIn;
  } catch (error) {
    errorHandler(error);
  }
}

export default userSignUp;
