import * as dotenv from 'dotenv';
dotenv.config();

import { draw_image, process_image } from './utils/sharpUtils';

import ImageData from './types/ImageData';
import { twitterClient } from './utils/twitterUtils';
import { pfpPath } from './utils/pathUtils';

// The number of followers displayed on the banner
const FOLLOWER_COUNT = 4;

const main = async () => {
	// Get user
	const me = await twitterClient.currentUser();
	
	// Get followers
	const followers = (
		await twitterClient.v2.followers(me.id_str, {
			max_results: FOLLOWER_COUNT,
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
		const left = [
			LEFT_OFFET,
			LEFT_OFFET + GAP,
			LEFT_OFFET,
			LEFT_OFFET + GAP,
		];
		followers.forEach((follower, index, arr) => {
			process_image({
				url: follower.profile_image_url!,
				image_path: pfpPath(follower.username),
			}).then(() => {
				const follower_avatar = {
					input: pfpPath(follower.username),
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

main();
setInterval(() => {
	main();
}, 120000); // 2 minute
