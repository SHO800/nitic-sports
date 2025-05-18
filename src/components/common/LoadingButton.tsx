"use client";

import React, {ReactNode, useCallback, useState} from "react";

// isLoadingは省略可能. onClickが非同期関数の場合, 処理中は自動的にLoading状態とみなす.
const LoadingButton = ({
                           children,
                           className = "",
                           onClick = () => {},
                           type = "button",
                           disabled = false,
                       }: {
    children: ReactNode;
    className: string;
    onClick: () => void | Promise<void>;
    type: "button" | "submit";
    disabled: boolean;
}) => {

    const [isProcessing, setIsProcessing] = useState(false);

    const handleClick = useCallback(async () => {
        if (disabled) return;
        setIsProcessing(true);
        await onClick();
        setIsProcessing(false);
    }, [onClick, disabled]);

    return (
        <button
            type={type}
            className={className + " relative flex justify-center items-center"}
            style={
                (disabled || isProcessing)
                    ? {color: "white", backgroundColor: "gray", cursor: "not-allowed"}
                    : undefined
            }
            onClick={handleClick}
            disabled={disabled || isProcessing}
        >
            <span className={(disabled || isProcessing) ? "opacity-0" : ""}>{children}</span>
            {(disabled || isProcessing) &&
                <span className="absolute justify-center items-center h-full block py-2">
                    <span
                        className="block animate-spin rounded-full h-full w-auto  aspect-square border-b-4 border-white-500"/>
                </span>
            }

        </button>
    );
};

export default LoadingButton;
