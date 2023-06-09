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

    const { text } = await openai.createTranscription(audioStream, "whisper-1", language).then((res) => {
      return res.data;
    });

    console.log(text);
    locals.text = text;

    return {
      text: text,
      fileName: audioUpload.name,
      success: true,
    };
  },
};
