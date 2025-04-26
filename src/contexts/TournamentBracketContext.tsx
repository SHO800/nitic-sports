import React, {createContext, RefObject, useCallback, useContext, useState} from 'react';
import {TournamentNode} from "@/utils/tournamentUtils";

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
    boxNodes: Record<number, TournamentNode>;
    registerNode: (matchId: number, node: TournamentNode) => void;
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
    const [boxNodes, setBoxNodes] = useState<Record<number, TournamentNode>>({});

    // refを登録する関数
    const registerNode = useCallback((matchId: number, node: TournamentNode) => {
        // boxNodes.current[matchId] = ref;
        setBoxNodes(prev => ({
            ...prev,
            [matchId]: node
        }));
    }, []);

    // // 特定のマッチIDの座標情報を取得する関数
    // const getBoxCoordinates = (matchId: number): BoxCoordinates | null => {
    //     const boxRef = boxNodes[matchId]?.current;
    //     if (boxRef) {
    //         const rect = boxRef.getBoundingClientRect();
    //         const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    //         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //
    //         return {
    //             x: rect.left + scrollLeft,
    //             y: rect.top + scrollTop,
    //             width: rect.width,
    //             height: rect.height,
    //             matchId
    //         };
    //     }
    //     return null;
    // };
    //
    // // すべてのボックスの座標情報を更新する関数
    // const updateBoxCoordinates = () => {
    //     const newCoordinates: Record<number, BoxCoordinates> = {};
    //
    //     Object.entries(boxNodes.current).forEach(([matchIdStr, ref]) => {
    //         const matchId = parseInt(matchIdStr, 10);
    //         const element = ref.current;
    //
    //         if (element) {
    //             const rect = element.getBoundingClientRect();
    //             const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    //             const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //
    //             newCoordinates[matchId] = {
    //                 x: rect.left + scrollLeft,
    //                 y: rect.top + scrollTop,
    //                 width: rect.width,
    //                 height: rect.height,
    //                 matchId
    //             };
    //         }
    //     });
    //
    //     setBoxCoordinates(newCoordinates);
    // };

    // // ウィンドウのリサイズ時に座標情報を更新
    // useEffect(() => {
    //     // 初回のレンダリング後に座標情報を更新
    //     updateBoxCoordinates();
    //
    //     // リサイズイベントのリスナーを設定
    //     window.addEventListener('resize', updateBoxCoordinates);
    //
    //     return () => {
    //         window.removeEventListener('resize', updateBoxCoordinates);
    //     };
    // }, []);
        

    // コンテキスト値
    const contextValue: TournamentBracketContextType = {
        registerNode,
        boxNodes,
        // updateBoxCoordinates
        
    };

    return (
        <TournamentBracketContext.Provider value={contextValue}>
            {children}
        </TournamentBracketContext.Provider>
    );
};
