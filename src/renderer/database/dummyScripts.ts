import { InputTypes } from "../../common/constants/input";
import { OperationTypes } from "../../common/constants/operation";
import { Script } from "../types/script";

export const topYoutubeVideosScript: Script = {
  favorite: 0,
  name: "Top YouTube videos",
  description: "Fetches list of top videos from YouTube",
  operations: [
    {
      type: OperationTypes.OPEN,
      inputs: [{ type: InputTypes.TEXT, value: "https://www.youtube.com/" }]
    },
    {
      type: OperationTypes.EXTRACT,
      inputs: [
        { type: InputTypes.TEXT, value: "Title" },
        { type: InputTypes.TEXT, value: "yt-formatted-string#video-title" },
        { type: InputTypes.SELECT, value: "textContent" }
      ]
    }
  ]
};
