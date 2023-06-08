import { fail } from "@sveltejs/kit";
import fs from "fs";

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

    fs.writeFileSync(`static/${audioUpload.name}`, Buffer.from(await audioUpload.arrayBuffer()));

    await sleep(6000);

    fs.rmSync(`static/${audioUpload.name}`, { force: true });

    return {
      success: true,
    };
  },
};
