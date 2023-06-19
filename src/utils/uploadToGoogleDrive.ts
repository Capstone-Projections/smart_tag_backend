import { google } from 'googleapis';
import * as fs from 'fs';

async function uploadToGoogleDrive(
    csvFilePath: string,
    destinationFolderId: string
): Promise<string> {
    const credentials = JSON.parse(process.env.CREDENTIALS || '');
    const auth = new google.auth.OAuth2();
    auth.setCredentials(credentials);

    const drive = google.drive({ version: 'v3', auth });

    const csvReadStream = fs.createReadStream(csvFilePath);

    const fileMetadata = {
        name: csvFilePath.split('/').pop(), // Extract the file name from the file path
        parents: [destinationFolderId], // Replace with the ID of the folder where you want to upload the file
    };

    const media = {
        mimeType: 'text/csv',
        body: csvReadStream,
    };

    try {
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'webViewLink',
        });

        const webViewLink = response.data.webViewLink ?? ''; // Provide a default value if webViewLink is null or undefined
        return webViewLink;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
    }
}
