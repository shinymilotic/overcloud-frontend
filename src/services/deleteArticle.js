import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function deleteArticle({ id, headers }) {
  try {
    const { data } = await axios({
      headers,
      method: "DELETE",
      url: `api/articles/${id}`,
    });

    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default deleteArticle;
