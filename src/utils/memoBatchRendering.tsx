import React, { type ReactNode, useMemo, memo } from "react";

/**
 * 大量のノードを効率的にレンダリングするためのバッチ処理ユーティリティ
 * 指定された数のアイテムごとにチャンク分割してメモ化して再レンダリングを最小化
 */
export function batchMemoNodes<T>(
	items: T[],
	renderItem: (item: T, index: number) => ReactNode,
	batchSize = 10,
	keyExtractor?: (item: T, index: number) => string,
): ReactNode[] {
	if (!items || items.length === 0) {
		return [];
	}

	// アイテムをチャンクに分割
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += batchSize) {
		chunks.push(items.slice(i, i + batchSize));
	}

	// 各チャンクに対するメモ化コンポーネントを生成
	return chunks.map((chunk, chunkIndex) => {
		const BatchComponent = memo(
			({ items, start }: { items: T[]; start: number }) => (
				<>
					{items.map((item, index) => {
						const actualIndex = start + index;
						const key = keyExtractor
							? keyExtractor(item, actualIndex)
							: actualIndex;
						return (
							<React.Fragment key={key}>
								{renderItem(item, actualIndex)}
							</React.Fragment>
						);
					})}
				</>
			),
		);

		BatchComponent.displayName = `BatchComponent${chunkIndex}`;

		return (
			<BatchComponent
				key={`batch-${chunkIndex}`}
				items={chunk}
				start={chunkIndex * batchSize}
			/>
		);
	});
}

/**
 * チャンク分割とメモ化を行うためのReactフック
 */
export function useChunkedMemo<T, R>(
	items: T[],
	processor: (items: T[]) => R,
	deps: React.DependencyList = [],
	chunkSize = 50,
): R {
	return useMemo(() => {
		if (!items || items.length === 0) {
			return processor([]) as R;
		}
		return processor(items);
	}, [items, processor, chunkSize, ...deps]);
}

export default batchMemoNodes;
