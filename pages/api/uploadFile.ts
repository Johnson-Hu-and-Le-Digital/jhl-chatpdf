import { NextApiRequest, NextApiResponse } from 'next';
import fs from "node:fs/promises";
// import { revalidatePath } from "next/cache";

export default async function handler(
  // formData: FormData,
  req: NextApiRequest,
  res: NextApiResponse
) {

  console.log(req);
  // const { files } = req.body;
  // console.log(req.body);
  // console.log(files);
  const { files } = req.body.formData;
  console.log(files);

  if (files) {
    console.log(files.path);
    const file = files.File;
    console.log(file);
    if (file) {
      const file = files.file;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      await fs.writeFile(`./public/pdffloder/${file.name}`, buffer);

      return res.status(200).json({ message: 'File uploaded successfully' });
    }
  }
  // return res.status(200).json({ message: 'File uploaded successfully' });
  return res.status(400).json({ error: 'No file uploaded' });

}
