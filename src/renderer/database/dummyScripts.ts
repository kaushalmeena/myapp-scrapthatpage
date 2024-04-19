import { Script } from "../types/script";

export const mostPopularMoviesScript: Script = {
  favorite: 0,
  name: "Most Popular Movies",
  description: "Fetches list of popular movies from IMDb",
  operations: [
    {
      type: "open",
      inputs: [
        { type: "text", value: "https://www.imdb.com/chart/moviemeter/" }
      ]
    },
    {
      type: "extract",
      inputs: [
        { type: "text", value: "Title" },
        { type: "text", value: "li .ipc-title__text" },
        { type: "select", value: "textContent" }
      ]
    }
  ]
};
