"use client";

import { createContext, useContext } from "react";

import type { IDataContext } from "./types";

export const DataContext = createContext<IDataContext | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
