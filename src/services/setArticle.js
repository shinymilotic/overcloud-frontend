import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function setArticle({ body, description, headers, slug, tagList, title }) {
  try {
    const { data } = await axios({
      data: { articles: { title, description, body, tagList } },
      headers,
      method: slug ? "PUT" : "POST",
      url: slug ? `api/articles/${slug}` : "api/articles",
    });

    return data.articles.id;
  } catch (error) {
    errorHandler(error);
  }
}

export default setArticle;
