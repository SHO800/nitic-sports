type Props ={
    location: string | undefined;
}

const MapPin = ({location}: Props) => {
    return (
        <>
            {(location?.includes("第1体育館")) &&(
                <>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-[50%_50%_50%_0] rotate-[-45deg] animate-ping opacity-75 mt-30 ml-31.5"></div>
                    
                    <div className="inset-0 w-5 h-5 bg-red-600 rounded-[50%_50%_50%_0] rotate-[-45deg] absolute shadow-md mt-30 ml-31.5">
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-[5px] left-[5px]"></div>
                    </div>
                </>
            )}
            {(location?.includes("第2体育館")) &&(
                <>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-[50%_50%_50%_0] rotate-[-45deg] animate-ping opacity-75 mt-36 ml-9"></div>

                    <div className="inset-0 w-5 h-5 bg-red-600 rounded-[50%_50%_50%_0] rotate-[-45deg] absolute shadow-md mt-36 ml-9">
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-[5px] left-[5px]"></div>
                    </div>
                </>
            )}
            {(location?.includes("陸上グラウンド")) &&(
                <>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-[50%_50%_50%_0] rotate-[-45deg] animate-ping opacity-75 mt-10 ml-57.5"></div>

                    <div className="inset-0 w-5 h-5 bg-red-600 rounded-[50%_50%_50%_0] rotate-[-45deg] absolute shadow-md mt-10 ml-57.5">
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-[5px] left-[5px]"></div>
                    </div>
                </>
            )}

            {(location === "テニスコートA" || location === "テニスコートB") &&(
                <>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-[50%_50%_50%_0] rotate-[-45deg] animate-ping opacity-75 mt-51 ml-40"></div>

                    <div className="inset-0 w-5 h-5 bg-red-600 rounded-[50%_50%_50%_0] rotate-[-45deg] absolute shadow-md mt-51 ml-40">
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-[5px] left-[5px]"></div>
                    </div>
                </>
            )}

            {(location === "テニスコートC" || location === "テニスコートD") &&(
                <>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-[50%_50%_50%_0] rotate-[-45deg] animate-ping opacity-75 mt-47.5 ml-60"></div>

                    <div className="inset-0 w-5 h-5 bg-red-600 rounded-[50%_50%_50%_0] rotate-[-45deg] absolute shadow-md mt-47.5 ml-60">
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-[5px] left-[5px]"></div>
                    </div>
                </>
            )}
            
            {(location?.includes("野球グラウンド")) &&(
                <>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-[50%_50%_50%_0] rotate-[-45deg] animate-ping opacity-75 mt-67 ml-69"></div>

                    <div className="inset-0 w-5 h-5 bg-red-600 rounded-[50%_50%_50%_0] rotate-[-45deg] absolute shadow-md mt-67 ml-69">
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-[5px] left-[5px]"></div>
                    </div>
                </>
            )}
            
        </>
    )
}

export default MapPin;