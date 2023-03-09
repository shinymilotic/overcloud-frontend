import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getArticle({ headers, slug }) {
  try {
    const { data } = await axios({ headers, url: `api/articles/${slug}` });

      return data.articles[0];
  } catch (error) {
    errorHandler(error);
  }
}

export default getArticle;
