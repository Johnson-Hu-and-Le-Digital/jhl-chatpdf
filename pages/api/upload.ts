import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from "fs";
import path from "path";
import { File } from 'formidable';
import * as formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, File]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully' };

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, (fields, files) => {
          console.log(files.filepath);
          req.body = files;
        });

    }).catch(e => {
        // console.log(e);
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
    });

    // console.log(files);

    if (files?.length) {
        /* Create directory for uploads */
        // const targetPath = path.join(process.cwd(), `/uploads/`);
        // try {
        //     await fs.access(targetPath);
        // } catch (e) {
        //     await fs.mkdir(targetPath);
        // }
        
        // const targetPath = process.env.PDF_DIRECTORY+'/directory3/';
        const targetPath = req.body.filepath+'/';
        /* Move uploaded files to directory */
        for (const file of files) {
            const tempPath = file[1].filepath;
            await fs.rename(tempPath, targetPath + file[1].originalFilename);
        }
    }

    res.status(status).json(resultBody);
}

export default handler;