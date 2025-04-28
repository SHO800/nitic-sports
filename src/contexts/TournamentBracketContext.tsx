import React, {createContext, RefObject, useCallback, useContext, useState} from 'react';
import {TournamentMatchNode} from "@/utils/tournamentUtils";

// 座標情報の型定義
export interface BoxCoordinates {
    x: number;
    y: number;
    width: number;
    height: number;
    matchId: number;
}

// コンテキストの型定義
interface TournamentBracketContextType {
    // registerBoxRef: (matchId: number, ref: RefObject<HTMLDivElement>) => void;
    // getBoxCoordinates: (matchId: number) => BoxCoordinates | null;
    boxNodes: Record<number, TournamentMatchNode>;
    registerNode: (matchId: number, node: TournamentMatchNode) => void;
}

// コンテキストの作成
const TournamentBracketContext = createContext<TournamentBracketContextType | null>(null);

// カスタムフック
export const useTournamentBracket = () => {
    const context = useContext(TournamentBracketContext);
    if (!context) {
        throw new Error('useTournamentBracket must be used within a TournamentBracketProvider');
    }
    return context;
};

// プロバイダーコンポーネント
export const TournamentBracketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // refとマッチIDの対応を管理するオブジェクト
    const [boxNodes, setBoxNodes] = useState<Record<number, TournamentMatchNode>>({});

    // refを登録する関数
    const registerNode = useCallback((matchId: number, node: TournamentMatchNode) => {
        setBoxNodes(prev => ({
            ...prev,
            [matchId]: node
        }));
    }, []);
    
    
    // コンテキスト値
    const contextValue: TournamentBracketContextType = {
        registerNode,
        boxNodes,
    };

    return (
        <TournamentBracketContext.Provider value={contextValue}>
            {children}
        </TournamentBracketContext.Provider>
    );
};
