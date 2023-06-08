import { fail } from "@sveltejs/kit";
import fs from "fs";

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

    return {
      success: true,
    };
  },
};
