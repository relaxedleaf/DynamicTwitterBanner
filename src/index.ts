import * as dotenv from 'dotenv';

import ImageData from './types/ImageData';
import Twitter from 'twitter-api-v2';
import axios from 'axios';
import fs from 'fs';
import sharp from 'sharp';

dotenv.config();

const twitterClient = new Twitter({
	appKey: process.env.CONSUMER_KEY!,
	appSecret: process.env.CONSUMER_SECRET!,
	accessToken: process.env.ACCESS_TOKEN!,
	accessSecret: process.env.ACCESS_TOKEN_SECRET!,
}).readWrite;

const main = async () => {
	const me = await twitterClient.currentUser();
	const followers = (
		await twitterClient.v2.followers(me.id_str, {
			max_results: 4,
			'user.fields': ['profile_image_url'],
		})
	).data;

	const image_data = [] as ImageData;
	let count = 0;

	const get_followers_img = new Promise<void>((resolve, reject) => {
		const LEFT_OFFET = 1200;
		const GAP = 80;
		const TOP = 110;
		const top = [TOP, TOP, TOP + GAP, TOP + GAP];
		const left = [LEFT_OFFET, LEFT_OFFET + GAP, LEFT_OFFET, LEFT_OFFET + GAP]
		followers.forEach((follower, index, arr) => {
			process_image({
				url: follower.profile_image_url!,
				image_path: `${follower.username}.png`,
			}).then(() => {
				const follower_avatar = {
					input: `${follower.username}.png`,
					top: top[index],
					left: left[index],
				};
				image_data.push(follower_avatar);
				count++;
				if (count === arr.length) resolve();
			});
		});
	});

	get_followers_img.then(() => {
		draw_image(image_data);
	});
};

const process_image = async ({
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

const draw_image = async (image_data: ImageData) => {
	try {
		await sharp('banner.png')
			.composite(image_data)
			.toFile('new-banner.png');

		// upload banner to twitter
		upload_banner(image_data);
	} catch (error) {
		console.log('error #2');
		// console.log(error);
	}
};

const upload_banner = async (files: ImageData) => {
	try {
		await twitterClient.v1
			.updateAccountProfileBanner('new-banner.png')
			.then(() => {
				console.log('Upload to Twitter done');
				delete_files(files);
			});
	} catch (error) {
		console.log('error #3');
		console.log(error);
	}
};

const delete_files = (files: ImageData) => {
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

main();
setInterval(() => {
	main();
}, 60000); // 1 minute
