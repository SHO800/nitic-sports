"use client"

type DeleteButtonProps = {
    matchId: number;
    onDelete: () => Promise<void>;
};

const DeleteButton = ({ matchId, onDelete }: DeleteButtonProps) => {
    return (
        <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded"
        >
            削除
        </button>
    );
};

export default DeleteButton;
