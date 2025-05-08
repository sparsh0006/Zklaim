"use client";
import { QRCodeCanvas } from 'qrcode.react'; // Direct import

interface QrCodeDisplayProps {
  eventId: string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ eventId }) => {
  const claimUrl = `${window.location.origin}/claim/${eventId}`;

  // Access the component via the namespace.
  // The actual component name is often 'default' when imported this way if it was meant to be a default export,
  // or it could be 'QRCode' or 'QRCodeCanvas' / 'QRCodeSVG'.
  // Let's try 'default' first as it's a common pattern for UMD/CommonJS modules.
  // If 'default' doesn't work, inspect QRCodeReact in your IDE or try QRCodeReact.QRCode
  const QRCodeComponent = QRCodeCanvas;


  return (
    <div className="text-center p-4">
      <QRCodeComponent
        value={claimUrl}
        size={200}
        level={"H"}
        includeMargin={true}
        className="inline-block"
      />
      <p className="mt-2 text-sm">
        <a href={claimUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">
          {claimUrl}
        </a>
      </p>
    </div>
  );
};

export default QrCodeDisplay;