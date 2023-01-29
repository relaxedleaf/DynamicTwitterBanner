import ImageData from '../types/ImageData';
import axios from 'axios';
import { delete_files } from './fileUtils';
import sharp from 'sharp';
import { twitterClient } from './twitterUtils';
import { bannerPath, newBannerPath } from './pathUtils';

export const process_image = async ({
	url,
	image_path,
}: {
	url: string;
	image_path: string;
}) => {
	await axios({
		url,
		responseType: 'arraybuffer',
	}).then(
		(response) =>
			new Promise((resolve, reject) => {
				const rounded_corners = Buffer.from(
					'<svg><rect x="0" y="0" width="65" height="65" rx="50" ry="50"/></svg>'
				);
				resolve(
					sharp(response.data)
						.resize(65, 65)
						.composite([
							{
								input: rounded_corners,
								blend: 'dest-in',
							},
						])
						.png()
						.toFile(image_path)
				);
			})
	);
};

export const draw_image = async (image_data: ImageData) => {
	try {
		await sharp(bannerPath())
			.composite(image_data)
			.toFile(newBannerPath());

		upload_banner(image_data);
	} catch (error) {
		console.log('Draw Image Error');
		console.log(error);
	}
};

export const upload_banner = async (files: ImageData) => {
	try {
		await twitterClient.v1
			.updateAccountProfileBanner(newBannerPath())
			.then(() => {
				console.log('Done uploading to Twitter');
				delete_files(files);
			});
	} catch (error) {
		console.log('Upload Banner Error');
		console.log(error);
	}
};