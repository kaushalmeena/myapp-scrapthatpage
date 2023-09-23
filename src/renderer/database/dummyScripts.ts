import { Script } from "../types/script";

export const topYoutubeVideosScript: Script = {
  favorite: 0,
  name: "Top YouTube videos",
  description: "Fetches list of top videos from YouTube",
  operations: [
    {
      type: "open",
      inputs: [{ type: "text", value: "https://www.youtube.com/" }]
    },
    {
      type: "extract",
      inputs: [
        { type: "text", value: "Title" },
        { type: "text", value: "yt-formatted-string#video-title" },
        { type: "select", value: "textContent" }
      ]
    }
  ]
};
