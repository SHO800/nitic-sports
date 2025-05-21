"use client";

import { useData } from "@/hooks/data";
import { type ReactNode, createContext, useContext } from "react";

export const DataContext = createContext<ReturnType<typeof useData> | null>(
	null,
);
export const useDataContext = () => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("DataContext must be used within a DataContextProvider");
	}

	return { ...context };
};

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
	return (
		<DataContext.Provider value={useData()}>{children}</DataContext.Provider>
	);
};

export const DataContextProviderWithRefresh = ({ children, refreshInterval }: { children: React.ReactNode, refreshInterval: number }) => {
	return (
		<DataContext.Provider value={useData({ refreshInterval })}>
			{children}
		</DataContext.Provider>
	);
};

