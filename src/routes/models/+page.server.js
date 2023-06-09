import { openai } from "$lib/openai";

const getModels = async () => {
  return await openai.listModels().then((res) => {
    return res.data;
  });
};

export async function load() {
  return {
    models: await getModels(),
  };
}
