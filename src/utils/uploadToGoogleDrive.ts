import { google } from 'googleapis';
import * as fs from 'fs';

export async function uploadToGoogleDrive(
    csvFilePath: string,
    destinationFolderId: string
): Promise<string> {
    const credentials = require('./credentials.json');

    const auth = new google.auth.OAuth2();

    auth.setCredentials(credentials);

    const drive = google.drive({ version: 'v3', auth });
    // console.log("hey");

    const csvReadStream = fs.createReadStream(csvFilePath);

    const fileMetadata = {
        name: csvFilePath.split('/').pop(),
        parents: [destinationFolderId],
    };

    try {
        // Check if the destination folder exists
        const folderResponse = await drive.files.get({
            fileId: destinationFolderId,
            fields: 'id',
        });

        // If the folder doesn't exist, create it
        if (!folderResponse.data.id) {
            const folderMetadata = {
                name: 'My Folder', // Specify the desired folder name
                mimeType: 'application/vnd.google-apps.folder',
                parents: [destinationFolderId],
            };

            const folderCreationResponse = await drive.files.create({
                requestBody: folderMetadata,
                fields: 'id',
            });

            fileMetadata.parents = [
                folderCreationResponse.data.id || destinationFolderId,
            ];
        }

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
