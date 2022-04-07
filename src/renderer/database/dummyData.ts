import { Script } from "../types/script";

export const topYoutubeVideosScript: Script = {
  favorite: 0,
  name: "Top YouTube videos",
  description: "Fetches list of top videos from YouTube",
  operations: [
    { type: 0, inputs: [{ type: 0, value: "https://www.youtube.com/" }] },
    {
      type: 1,
      inputs: [
        { type: 0, value: "Title" },
        { type: 0, value: "yt-formatted-string#video-title" },
        { type: 1, value: "textContent" }
      ]
    }
  ]
};
