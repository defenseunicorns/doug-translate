import { fail } from "@sveltejs/kit";
import { openai } from "$lib/openai"
import { Readable } from 'stream'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const actions = {
  default: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    if (formData.audioUpload === undefined) {
      return fail(400, {
        error: true,
        message: "You must provide a file to upload",
      });
    }
    const { audioUpload } = formData;

    console.log(audioUpload)

    const audioBuffer = Buffer.from(await audioUpload.arrayBuffer())
    const audioStream = Readable.from(audioBuffer)
    audioStream.path = audioUpload.name

    await openai.createTranscription(audioStream, 'whisper-1')
      .then((res) => {
        console.log(res.data)
        return res.data
      })

    return {
      success: true,
    };
  },
};
