import React, { useContext } from "react";

export default function useTestContext<T>(context: React.Context<T>): T {
  const value = useContext(context);
  if (typeof context === "undefined") {
    throw new Error("useContext must be used within a ContextProvide ");
  }
  return value;
}
