import { fail } from "@sveltejs/kit";
import { openai } from "$lib/openai";
import { Readable } from "stream";

export const actions = {
  upload: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    if (formData.audioUpload === undefined) {
      return fail(400, {
        error: true,
        message: "You must provide a file to upload",
      });
    }
    let { audioUpload, language } = formData;

    if (language === "auto") {
      language = undefined;
    }

    console.log(audioUpload);

    const audioBuffer = Buffer.from(await audioUpload.arrayBuffer());
    const audioStream = Readable.from(audioBuffer);
    audioStream.path = audioUpload.name;

    const raw = await openai.createTranscription(audioStream, "whisper-1", undefined, undefined, undefined, undefined, {
      maxBodyLength: 300 * 1024 * 1024,
    }).then((res) => {
      return res.data;
    });

    let { text } = raw;

    return {
      upload: {
        transcription: text,
        filename: audioUpload.name,
        success: true,
      },
    };
  },
  summarize: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    if (formData.transcription === undefined) {
      return fail(400, {
        error: true,
        message: "Something unexpected happened, the transcription is unavailable",
      });
    }
    const { transcription } = formData;

    const prompt = `<|SYSTEM|>you're such a cool summarizer<|USER|>${transcription}<|ASSISTANT|>`;

    const completion = await openai.createCompletion({
      model: "mpt-7b-chat",
      max_tokens: 50,
      temperature: 0.5,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      prompt,
    });
    const tokenizedResp = completion.data.choices[0].text;
    console.log(tokenizedResp);
    console.log(typeof tokenizedResp);
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
};
