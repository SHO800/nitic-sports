interface ClassSelectorProps {
    groupedData: Record<string, { id: number, name: string }[]>
    callback?: (id: number, name: string) => void
}

const ClassSelector = ({groupedData, callback}: ClassSelectorProps) => {
    
    return (
        <div
            className={"absolute top-0 left-0 w-fit h-fit px-1 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center"}>
            {
                groupedData ?
                    <table>
                        <tbody>
                        {Object.keys(groupedData).map((key) => (
                            <tr key={key} className={"border-y-[1px] border-white"}>
                                <td className="text-center text-2xl font-bold pr-2">{key}</td>
                                {
                                    groupedData[key].map((data) => (
                                        <td key={data.id} className="text-center text-lg font-bold">
                                            <button
                                                className={"bg-gray-200 w-18 m-1 hover:bg-gray-300 active:bg-gray-400 text-black px-4 py-2 rounded"}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (callback) {
                                                        callback(data.id, data.name)
                                                    }
                                                }}
                                            >
                                                {data.name}
                                            </button>
                                        </td>
                                    ))
                                }
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    :
                    <div className="text-center text-2xl font-bold">
                        読み込み中...
                    </div>
            }
        </div>
    );
}
export default ClassSelector;