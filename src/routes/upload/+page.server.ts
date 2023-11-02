import type { Actions, RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";
import { openai } from "$lib/openai";
import { toFile } from "openai";
import { env } from "$env/dynamic/private";
import path from "node:path";

export const actions = {
  upload: async ({ request }: RequestEvent) => {
    const formData = await request.formData();

    const audio = formData.get("audioUpload") as File;

    if (audio === undefined) {
      return fail(400, {
        error: true,
        message: "You must provide a file to upload",
      });
    }

    console.log("processsing audio file: ", audio.name);

    const buf = Buffer.from(await audio.arrayBuffer());
    const stream = await toFile(buf);

    const text = await openai.audio.transcriptions.create({ model: "whisper", file: stream }).then((res) => {
      return res.text;
    });

    return {
      upload: {
        transcription: text,
        path: path.parse(audio.name),
        success: true,
      },
    };
  },
  summarize: async ({ request }: RequestEvent) => {
    const formData = await request.formData();

    const transcription = formData.get("transcription");

    if (transcription === undefined) {
      return fail(400, {
        error: true,
        message: "Something unexpected happened, transcription is undefined",
      });
    }

    const model = env.SUMMARIZATION_MODEL || "ctransformers";

    const getSystemPrompt = (model: string, transcription: string) => {
      const systemBasePrompt =
        "You are a summarizer tasked with creating summaries." +
        "Your key activities include identifying the main points and key details in the given text, " +
        "and condensing the information into a concise summary that accurately reflects the original text. " +
        "It is important to avoid any risks such as misinterpreting the text, omitting crucial information, " +
        "or distorting the original meaning. Use clear and specific language, " +
        "ensuring that the summary is coherent, well-organized, and effectively communicates the main ideas of the " +
        "original text.";

      if (model === "ctransformers" || model === "mpt-7b-chat") {
        return `<|im_start|>system ${systemBasePrompt}<|im_end|>
        <|im_start|>user ${transcription}<|im_end|>
        <|im_start|>assistant `;
      }

      return `<|SYSTEM|>${systemBasePrompt}<|USER|>${transcription}<|ASSISTANT|>`;
    };

    const prompt = getSystemPrompt(model, transcription as string);

    const completion = await openai.completions.create({
      model: model,
      max_tokens: 500,
      temperature: 0.5,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      prompt,
    });
    const tokenizedResp = completion.choices[0].text;

    const assistantResponseToken = "<|ASSISTANT|>";

    const summary = tokenizedResp.substring(tokenizedResp.indexOf(assistantResponseToken)).replace(assistantResponseToken, "");

    return {
      upload: {
        transcription,
        success: true,
      },
      summarize: {
        success: true,
        summary,
      },
    };
  },
} satisfies Actions;
