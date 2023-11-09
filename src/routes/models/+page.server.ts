import { openai } from "$lib/openai";

export async function load() {
  return {
    models: await openai.models.list().then((res) => res.data)
  };
}
