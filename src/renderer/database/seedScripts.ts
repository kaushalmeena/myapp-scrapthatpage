import type { Script } from "../types/script";

export const mostPopularMoviesScript: Script = {
  favorite: false,
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
      // IMDb lazy-renders the chart; scrolling to the bottom loads all 100.
      type: "scroll",
      inputs: [{ type: "text", value: "" }]
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
