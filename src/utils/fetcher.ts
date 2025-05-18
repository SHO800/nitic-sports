"use cache";
/**
 * SWRで使用するfetcher関数
 * APIからのレスポンスを自動的にJSONに変換し、エラーハンドリングも実装
 */
const fetcher = async (url: string) => {
	try {
		const res = await fetch(url);

		// レスポンスが成功しなかった場合はエラーを投げる
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(`API エラー (${res.status}): ${errorText}`);
		}

		// レスポンスをJSONに変換して返す
		return res.json();
	} catch (error) {
		console.error(`Fetch error for ${url}:`, error);
		throw error;
	}
};

export default fetcher;
