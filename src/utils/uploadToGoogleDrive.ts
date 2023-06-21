import { google } from 'googleapis';
import * as fs from 'fs';
import path from 'path';

export async function uploadToGoogleDrive(
    csvFilePath: string,
    destinationFolderId: string
): Promise<string> {
    //TODO: include the creation of a folder for the particular course when creating the folder
    //TODO: also make sure that after the upload is done the file is also removed from the folder that it is in.
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
            fields: 'webViewLink',
        });

        const webViewLink = response.data.webViewLink ?? '';
        return webViewLink;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
    }
}
