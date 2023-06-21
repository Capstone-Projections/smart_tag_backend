import * as fs from 'fs';

export function deleteFileAfterUploading(filePath: string): void {
    try {
        fs.unlinkSync(filePath);
        console.log('File deleted successfully:', filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}
