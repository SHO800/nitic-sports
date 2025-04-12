import {ReactNode} from "react";

const MatchesWrapper = ({children, title}: {children: ReactNode,  title: string }) => {
    return (
        <div className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg">

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button className="text-blue-500 hover:text-blue-700">See all</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </div>
    );
}
export default MatchesWrapper;