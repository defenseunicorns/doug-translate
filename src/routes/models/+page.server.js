import { openai } from '$lib/openai';

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
