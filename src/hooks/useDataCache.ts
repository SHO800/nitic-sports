import { useState, useCallback, useEffect, useMemo } from 'react';
import { Event, MatchPlan, MatchResult, Team } from '@prisma/client';

// キャッシュのインターフェース
interface CacheData {
  timestamp: number;
  data: any;
}

// キャッシュのライフタイム（ミリ秒）
const CACHE_LIFETIME = 60000; // 1分

// グローバルキャッシュオブジェクト
const globalCache: Record<string, CacheData> = {};

export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options = { ttl: CACHE_LIFETIME }
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // キャッシュからデータを取得するか、ない場合はフェッチする関数
  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    const cachedItem = globalCache[key];

    // キャッシュが有効な場合はそれを使用
    if (
      !force &&
      cachedItem &&
      now - cachedItem.timestamp < options.ttl
    ) {
      setData(cachedItem.data);
      setLoading(false);
      return;
    }

    // そうでなければデータをフェッチ
    setLoading(true);
    try {
      const fetchedData = await fetcher();
      setData(fetchedData);
      
      // グローバルキャッシュを更新
      globalCache[key] = {
        timestamp: now,
        data: fetchedData,
      };
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, options.ttl]);

  // 依存配列が変更されたときにデータをフェッチ
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // 手動で再フェッチするための関数
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// イベント間で共有できる計算結果のメモ化キャッシュ
const calculationCache: Record<string, any> = {};

export function useMemoizedCalculation<T>(
  key: string,
  calculator: () => T,
  dependencies: any[]
): T {
  return useMemo(() => {
    const cacheKey = `${key}:${dependencies.map(dep => String(dep)).join(',')}`;
    
    if (calculationCache[cacheKey]) {
      return calculationCache[cacheKey];
    }
    
    const result = calculator();
    calculationCache[cacheKey] = result;
    return result;
  }, [key, calculator, ...dependencies]);
}

// 特定のデータ型に特化したフック
export function useEventCache(eventId?: number) {
  return useDataCache<Event[]>(
    'events',
    async () => {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    },
    [eventId]
  );
}

export function useMatchPlansCache(eventId?: number) {
  return useDataCache<MatchPlan[]>(
    `matchPlans:${eventId}`,
    async () => {
      const response = await fetch(`/api/events/${eventId}/matchPlans`);
      if (!response.ok) throw new Error('Failed to fetch match plans');
      return await response.json();
    },
    [eventId]
  );
}

export function useMatchResultsCache(eventId?: number) {
  return useDataCache<Record<string, MatchResult>>(
    `matchResults:${eventId}`,
    async () => {
      const response = await fetch(`/api/events/${eventId}/matchResults`);
      if (!response.ok) throw new Error('Failed to fetch match results');
      return await response.json();
    },
    [eventId]
  );
}

export function useTeamsCache() {
  return useDataCache<Team[]>(
    'teams',
    async () => {
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      return await response.json();
    },
    []
  );
}

export default useDataCache;
