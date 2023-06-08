import { Configuration, OpenAIApi } from "openai";
import { LEAPFROGAI_BASE_URL } from "$env/static/private";

const configuration = new Configuration();
configuration.basePath = LEAPFROGAI_BASE_URL;
export const openai = new OpenAIApi(configuration);
