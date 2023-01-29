import path from 'path';

export const pfpPath = (username: string) => {
	return path.join('assets', 'pfps', `${username}.png`);
};

export const bannerPath = () => {
    return path.join('assets', 'banners', 'banner.png');
}

export const newBannerPath = () => {
    return path.join('assets', 'banners', 'new-banner.png');
}
