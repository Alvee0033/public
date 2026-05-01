"use client"

import { createContext, useContext, useState } from "react"

const SPConnectContext = createContext(undefined)

export function SPConnectProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SPConnectContext.Provider
      value={{
        isOpen,
        openWidget: () => setIsOpen(true),
        closeWidget: () => setIsOpen(false),
      }}
    >
      {children}
    </SPConnectContext.Provider>
  )
}

export function useSPConnect() {
  const context = useContext(SPConnectContext)
  if (!context) {
    throw new Error("useSPConnect must be used within SPConnectProvider")
  }
  return context
}
