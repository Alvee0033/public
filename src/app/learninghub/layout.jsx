"use client";

import DeferredHeader from '@/components/layout/header/DeferredHeader'
import CartContextProvider from '@/contexts/CartContext'
import { HubDirectoryGeoProvider } from '@/contexts/HubDirectoryGeoContext'
import { stableSWRConfig } from '@/lib/swr-config'
import { SWRConfig } from 'swr'

export default function PublicLayout({ children }) {
    return (
        <CartContextProvider>
            <HubDirectoryGeoProvider>
                <div className="flex flex-col min-h-screen">
                    <DeferredHeader />
                    <SWRConfig value={stableSWRConfig}>
                        <main className="flex-1">{children}</main>
                    </SWRConfig>
                </div>
            </HubDirectoryGeoProvider>
        </CartContextProvider>
    )
}
