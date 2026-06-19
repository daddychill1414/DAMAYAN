import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode } from 'lucide-react';

export const QRDisplay = ({ qrData, verificationCode, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary/10">
        <QRCodeSVG value={qrData} size={48} bgColor="transparent" fgColor="#2E4036" level="M" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] text-dark/40 uppercase tracking-wider mb-0.5">Verification Code</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-primary">{verificationCode}</span>
            <button onClick={handleCopy} className="p-1 hover:bg-primary/5 rounded transition-colors">
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-dark/40" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-white rounded-2xl border border-primary/10 shadow-lg shadow-primary/5">
      {/* QR Code */}
      <div className="p-4 bg-background rounded-2xl border border-primary/5">
        <QRCodeSVG
          value={qrData}
          size={160}
          bgColor="#F2F0E9"
          fgColor="#2E4036"
          level="H"
          includeMargin={false}
          imageSettings={{
            src: '',
            height: 0,
            width: 0,
          }}
        />
      </div>

      {/* Divider with "or" */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-[1px] bg-primary/10"></div>
        <span className="font-outfit text-[10px] text-dark/40 uppercase tracking-wider">or use code</span>
        <div className="flex-1 h-[1px] bg-primary/10"></div>
      </div>

      {/* Manual Code */}
      <div className="w-full">
        <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-primary/10">
          <div className="flex items-center gap-3">
            <QrCode size={16} className="text-accent" />
            <span className="font-mono text-xl font-bold text-primary tracking-[0.3em]">{verificationCode}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                <span className="font-outfit text-[10px] text-green-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-dark/50" />
                <span className="font-outfit text-[10px] text-dark/50 font-semibold">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reminder */}
      <div className="w-full p-3 bg-accent/5 border border-accent/15 rounded-xl">
        <p className="font-outfit text-xs text-accent/80 text-center leading-relaxed">
          🔒 Secure your code/QR for verification. Present this at the drop-off point.
        </p>
      </div>
    </div>
  );
};
