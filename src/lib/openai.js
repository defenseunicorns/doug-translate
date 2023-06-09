import { Configuration, OpenAIApi } from "openai";
import { env } from "$env/dynamic/private";

const configuration = new Configuration();
configuration.basePath = env.LEAPFROGAI_BASE_URL;
export const openai = new OpenAIApi(configuration);
