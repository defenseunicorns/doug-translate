import { fail } from "@sveltejs/kit";
import { openai } from "$lib/openai";
import { Readable } from "stream";

export function load(event) {
  return {
    text: event.locals.text,
  };
}

export const actions = {
  upload: async ({ request, locals }) => {
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

    console.log(formData);
    console.log(audioUpload);

    const audioBuffer = Buffer.from(await audioUpload.arrayBuffer());
    const audioStream = Readable.from(audioBuffer);
    audioStream.path = audioUpload.name;

    let text;

    try {
       const rawResp = await openai
        .createTranscription(audioStream, "whisper-1")
        .then((res) => {
          return res.data;
        });
        text = rawResp.text
    } catch (err) {
      console.log(err)
      return {
        upload: {
          success: false
        }
      }
    }

    console.log(text);
    locals.text = text;

    return {
      upload: {
        text,
        filename: audioUpload.name,
        success: true,
      }
    };
  },
  summarize: async ({ request, locals }) => {
    const formData = Object.fromEntries(await request.formData());
    if (formData.submit === undefined) {
      return fail(400, {
        error: true,
        message: "Something unexpected happened, the transcription is unavailable",
      });
    }
    const { submit: transcription } = formData;

    const prompt = `<|SYSTEM|>you're such a cool summarizer<|USER|>${transcription}<|ASSISTANT|>`
    let summary;
  
    try {
      const completion = await openai.createCompletion({
        model: "stablelm-3b",
        max_tokens: 50,
        temperature: 0.5,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        prompt,
      });
      const tokenizedResp = completion.data.choices[0].text
      console.log(tokenizedResp);
      console.log(typeof tokenizedResp);
      const assistantResponseToken = "<|ASSISTANT|>"

      summary = tokenizedResp.substring(tokenizedResp.indexOf(assistantResponseToken)).replace(assistantResponseToken, "")

    } catch (err) {
      console.log(err)
      return {
        summarize: {
          success: false
        }
      }
    }

    return {
      summarize: {
        success: true,
        summary
      }
    }
  }
};
