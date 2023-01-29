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

// 'created_at' | 'description' | 'entities' | 'id' | 'location' | 'name' | 'pinned_tweet_id' | 'profile_image_url' | 'protected' | 'public_metrics' | 'url' | 'username' | 'verified' | 'withheld';
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
		followers.forEach((follower, index, arr) => {
			process_image({
				url: follower.profile_image_url!,
				image_path: `${follower.username}.png`,
			}).then(() => {
				const follower_avatar = {
					input: `${follower.username}.png`,
					top: 380,
					left: parseInt(`${1050 + 120 * index}`),
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
					'<svg><rect x="0" y="0" width="100" height="100" rx="50" ry="50"/></svg>'
				);
				resolve(
					sharp(response.data)
						.resize(100, 100)
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

const create_text = async ({
	width,
	height,
	text,
}: {
	width: number;
	height: number;
	text: string;
}) => {
	try {
		const svg_img = `
			<svg width="${width}" height="${height}">
				<style>
					.text {
						font-size: 64px;
						fill: #000;
						font-weight: 700;
					}
				</style>
				<text x="0%" y="0%" text-anchor="middle" class="text">${text}</text>
			</svg>
		`;
		const svg_img_buffer = Buffer.from(svg_img);
		return svg_img_buffer;
	} catch (error) {
		console.log(error);
	}
};

const draw_image = async (image_data: ImageData) => {
	try {
		const hour = new Date().getHours();
		const welcomeTypes = ['Morning', 'Afternoon', 'Evening'];
		let welcomeText = '';

		if (hour < 12) welcomeText = welcomeTypes[0];
		else if (hour < 18) welcomeText = welcomeTypes[1];
		else welcomeText = welcomeTypes[2];

		const svg_greeting = await create_text({
			width: 500,
			height: 100,
			text: welcomeText,
		});

		image_data.push({
			input: svg_greeting,
			top: 52,
			left: 220,
		});

		await sharp('twitter-banner.png')
			.composite(image_data)
			.toFile('new-twitter-banner.png');

		// upload banner to twitter
		upload_banner(image_data);
	} catch (error) {
		console.log(error);
	}
};

const upload_banner = async (files: ImageData) => {
	try {
		const base64 = await fs.readFileSync('new-twitter-banner.png', {
			encoding: 'base64',
		});
		await twitterClient.v1.updateAccountProfileBanner(base64).then(() => {
			console.log('Upload to Twitter done');
			delete_files(files);
		});
	} catch (error) {
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
