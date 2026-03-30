'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type AdminBarDoc = {
  collection: string
  id: string
  collectionLabels?: { singular: string; plural: string } | undefined
} | null

type AdminBarContextType = {
  doc: AdminBarDoc
  setDoc: (doc: AdminBarDoc) => void
}

const AdminBarContext = createContext<AdminBarContextType>({
  doc: null,
  setDoc: () => {},
})

export function AdminBarProvider({ children }: { children: ReactNode }) {
  const [doc, setDoc] = useState<AdminBarDoc>(null)
  return (
    <AdminBarContext.Provider value={{ doc, setDoc }}>
      {children}
    </AdminBarContext.Provider>
  )
}

export const useAdminBar = () => useContext(AdminBarContext)
