import { google } from 'googleapis';
import * as fs from 'fs';
import path from 'path';
import { deleteFileAfterUploading } from './deleteFile';
import { json } from 'stream/consumers';

export async function uploadToGoogleDrive(
    csvFilePath: string,
    destinationFolderId: string
): Promise<string> {
    //TODO: include the creation of a folder for the particular course when creating the folder
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

    const oAuthClient = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oAuthClient.setCredentials({ refresh_token: REFRESH_TOKEN });

    const drive = google.drive({ version: 'v3', auth: oAuthClient });
    // console.log("hey");
    const fileDirectory = '../../' + csvFilePath;
    const filePath = path.join(__dirname, fileDirectory);
    const csvReadStream = fs.createReadStream(filePath);

    const fileMetadata = {
        name: csvFilePath.split('/').pop(),
    };

    try {
        const media = {
            mimeType: 'text/csv',
            body: csvReadStream,
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'webViewLink,webContentLink,id',
        });

        const fileId = response.data.id ?? '';

        const webContentLink = response.data.webContentLink ?? '';

        //this gives open permissions for the file that was uploaded
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        //this is to delet the file after it has been uploaded
        //TODO: remoe this delete file from here and place it in the handler portion
        // deleteFileAfterUploading(filePath);
        return webContentLink;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
    }
}
