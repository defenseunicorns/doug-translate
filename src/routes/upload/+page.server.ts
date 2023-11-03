import type { Actions, RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";
import { openai } from "$lib/openai";
import { toFile } from "openai";
import { env } from "$env/dynamic/private";
import path from "node:path";

export const actions = {
  upload: async ({ request }: RequestEvent) => {
    const formData = await request.formData();

    const audioFile = formData.get("audioUpload") as File;

    if (!audioFile) {
      return fail(400, {
        error: true,
        message: "You must provide a file to upload",
      });
    }

    console.log(
      `Now processing ${audioFile.name} (${audioFile.type}) of size ${
        audioFile.size / 1000000
      }MB.`
    );

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audioStream = await toFile(audioBuffer);

    const text = await openai.audio.transcriptions
      .create({ model: "whisper", file: audioStream })
      .then((res) => {
        const transcription = res.text;
        console.log(
          `\nTranscription Length: ${transcription.length} characters\n` +
            `\nTranscription Text: ${transcription}\n`
        );
        return transcription;
      })
      .catch((error) => {
        return fail(400, {
          error: true,
          message: error.message.toString(),
        });
      });

    return {
      upload: {
        transcript: text,
        name: path.parse(audioFile.name).name,
        success: true,
      },
    };
  },
  summarize: async ({ request }: RequestEvent) => {
    const formData = await request.formData();

    const transcript = formData.get("transcription") as string;

    const name = formData.get("name") as string;

    if (transcript === undefined) {
      return fail(400, {
        error: true,
        message: "Something unexpected happened, transcript is undefined",
      });
    }

    console.log("processsing transcript: ", transcript?.slice(0, 20), "...");

    const model = env.SUMMARIZATION_MODEL || "ctransformers";

    const base =
      "You are a summarizer tasked with creating summaries." +
      "Your key activities include identifying the main points and key details in the given text, " +
      "and condensing the information into a concise summary that accurately reflects the original text. " +
      "It is important to avoid any risks such as misinterpreting the text, omitting crucial information, " +
      "or distorting the original meaning. Use clear and specific language, " +
      "ensuring that the summary is coherent, well-organized, and effectively communicates the main ideas of the " +
      "original text.";

    let prompt = "";

    switch (model) {
      case "mpt-7b-chat":
      case "ctransformers":
        prompt = `<|im_start|>system ${base}<|im_end|>
        <|im_start|>user ${transcript}<|im_end|>
        <|im_start|>assistant `;
        break;
      default:
        prompt = `<|SYSTEM|>${base}<|USER|>${transcript}<|ASSISTANT|>`;
    }
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

    const summary = tokenizedResp
      .substring(tokenizedResp.indexOf(assistantResponseToken))
      .replace(assistantResponseToken, "");

    return {
      upload: {
        transcript,
        name,
        success: true,
      },
      summarize: {
        success: true,
        summary,
      },
    };
  },
} satisfies Actions;
