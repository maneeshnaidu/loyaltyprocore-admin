"use client"

import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface QrScannerProps {
    onScanSuccess: (decodedText: string) => void
    onClose: () => void
}

export function QrScanner({ onScanSuccess, onClose }: QrScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)
    const scannerContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!scannerContainerRef.current) return

        // Initialize scanner
        scannerRef.current = new Html5QrcodeScanner(
            "qr-scanner-container",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                rememberLastUsedCamera: true,
            },
            false
        )

        scannerRef.current.render(
            (decodedText) => {
                onScanSuccess(decodedText)
                stopScanner()
            },
            (error) => {
                console.error("QR scan error:", error)
            }
        )

        return () => {
            stopScanner()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onScanSuccess])

    const stopScanner = () => {
        scannerRef.current?.clear().catch((error) => {
            console.error("Failed to clear scanner:", error)
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={stopScanner}
                >
                    <X className="h-4 w-4" />
                </Button>

                <h2 className="mb-4 text-lg font-semibold">Scan QR Code</h2>

                <div
                    id="qr-scanner-container"
                    ref={scannerContainerRef}
                    className="overflow-hidden rounded-lg"
                />

                <div className="mt-4 text-sm text-gray-500">
                    Point your camera at a QR code to scan
                </div>
            </div>
        </div>
    )
}