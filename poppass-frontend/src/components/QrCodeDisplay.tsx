"use client";
import { QRCodeCanvas } from 'qrcode.react';

interface QrCodeDisplayProps {
  eventId: string; // Kept for potential future use, but claimUrl is now primary
  claimUrl: string; // Pass the fully constructed claim URL
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ claimUrl }) => {
  // No internal div for background or padding, parent will handle it
  return (
      // ...
      <QRCodeCanvas
        value={claimUrl}
        size={150}
        level={"H"}
        includeMargin={false}
        bgColor="#FFFFFF"      // White background for QR
        fgColor="#1A1A1D"      // Dark foreground for QR dots (e.g., a very dark gray or black)
                               // Could also use your darkest theme color like gp-deep-blue-purple if it's dark enough
        className="block"
      />
// ...
  );
};

export default QrCodeDisplay;

