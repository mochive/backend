type PromiseArray<T> = {
	[K in keyof T]: Promise<T[K]>;
}

export function resolveInSequence<T extends unknown[]>(promises: PromiseArray<T>): Promise<T> {
	const results: T[number][] = [];

	return promises.reduce(function (previousPromise: Promise<T[number]>, currentPromise: Promise<T[number]>): Promise<T[number]> {
		return previousPromise
		.then(function (result: T[number]): Promise<T[number]> {
			results.push(result);

			return currentPromise;
		});
	})
	.then(function (result: T[number]): T {
		return results.concat(result) as T;
	});
}

export function getQueryArray(query: string): number[] {
	let currentIndex: number = query.indexOf(',');
	const array: number[] = [Number(query.slice(0, currentIndex !== -1 ? currentIndex : undefined))];
	let lastIndex: number = currentIndex + 1;

	while(lastIndex !== 0) {
		currentIndex = query.indexOf(',', lastIndex);

		array.push(Number(query.slice(lastIndex,  currentIndex !== -1 ? currentIndex : undefined)));

		lastIndex = currentIndex + 1;
	}

	return array;
}

export function getFullDate(date: Date): string {
	return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}