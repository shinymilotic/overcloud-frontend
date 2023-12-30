export interface ArticleListConfig {
  filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    size?: number;
    lastArticleId?: string;
  };
}
