import OpenAI from "openai";
import { env } from "$env/dynamic/private";

const openai = new OpenAI();

openai.baseURL = env.LEAPFROGAI_BASE_URL;

export { openai };
