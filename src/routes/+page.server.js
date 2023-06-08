import { Configuration, OpenAIApi } from "openai";
import { LEAPFROGAI_BASE_URL } from "$env/static/private";

const configuration = new Configuration();
configuration.basePath = LEAPFROGAI_BASE_URL;
const openai = new OpenAIApi(configuration);
const getModels = async () => {
  return await openai
    .listModels()
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(LEAPFROGAI_BASE_URL);
    });
};

export async function load() {
  return {
    models: await getModels(),
  };
}
