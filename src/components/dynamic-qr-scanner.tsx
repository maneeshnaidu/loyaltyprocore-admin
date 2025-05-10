"use client"

import dynamic from "next/dynamic"
import { QrScannerProps } from "./qr-scanner"

export const DynamicQrScanner = dynamic(
    () => import("./qr-scanner").then((mod) => mod.QrScanner),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center p-8">
                <p>Loading scanner...</p>
            </div>
        ),
    }
) as React.FC<QrScannerProps>