import OpenAI from "openai";
import { env } from "$env/dynamic/private";

const openai = new OpenAI({
  apiKey: "empty",
  baseURL: env.LEAPFROGAI_BASE_URL,
});

export { openai };
