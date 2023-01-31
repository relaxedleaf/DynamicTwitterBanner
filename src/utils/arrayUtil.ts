type CompareOptions = {
	sorted: boolean;
};

export const areArraysEqual = (
	arr1: Array<string>,
	arr2: Array<string>,
	options?: CompareOptions
) => {
	const nArr1 = [...arr1];
	const nArr2 = [...arr2];

	if (nArr1.length !== nArr2.length) {
		return false;
	}

	if (options) {
		const { sorted } = options;
		if (!sorted) {
			nArr1.sort();
			nArr2.sort();
		}
	}

	for (let i = 0; i < nArr1.length; i++) {
		if (nArr1[i] !== nArr2[i]) {
			return false;
		}
	}

	return true;
};
