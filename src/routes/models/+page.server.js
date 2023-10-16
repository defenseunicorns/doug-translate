import { openai } from "$lib/openai";

const getModels = async () => {
  return await openai.models.list().then((res) => {
    return res.data;
  });
};

export async function load() {
  return {
    models: await getModels(),
  };
}
