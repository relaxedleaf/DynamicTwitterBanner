import ImageData from '../types/ImageData';
import fs from 'fs';

export const delete_files = (files: ImageData) => {
	try {
		files.forEach((file) => {
			if (file.input?.includes('.png')) {
				fs.unlinkSync(file.input);
				console.log('File removed');
			}
		});
	} catch (err) {
		console.error(err);
	}
};
