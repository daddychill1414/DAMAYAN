import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, Download } from 'lucide-react';
import { useStore } from '../store';
import { HelperTooltip } from './HelperTooltip';

export const QRDisplay = ({ qrData, verificationCode, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useStore();
  const svgRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    showToast('Verification code copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Add padding and background
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#F2F0E9'; // Match background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Damayan-QR-${verificationCode}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
      showToast('QR Code saved to device!', 'success');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary/10">
        <QRCodeSVG value={qrData} size={48} bgColor="transparent" fgColor="#2E4036" level="M" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] text-dark/40 uppercase tracking-wider mb-0.5">Verification Code</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-primary">{verificationCode}</span>
            <button onClick={handleCopy} className="p-1 hover:bg-primary/5 rounded transition-colors" title="Copy Code">
              {copied ? <Check size={12} className="text-urgency-stable" /> : <Copy size={12} className="text-dark/40" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-white rounded-2xl border border-primary/10 shadow-lg shadow-primary/5 relative">
      <div className="absolute top-4 right-4">
        <HelperTooltip text="Save this QR code and show it to the barangay coordinator at the drop-off point to verify your donation." position="left" />
      </div>

      {/* QR Code */}
      <div className="relative group">
        <div ref={svgRef} className="p-4 bg-background rounded-2xl border border-primary/5 transition-transform group-hover:scale-105">
          <QRCodeSVG
            value={qrData}
            size={160}
            bgColor="#F2F0E9"
            fgColor="#2E4036"
            level="H"
            includeMargin={false}
          />
        </div>
        
        {/* Download Overlay */}
        <button 
          onClick={handleDownload}
          className="absolute inset-0 bg-primary/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
        >
          <Download size={24} />
          <span className="font-outfit text-xs font-bold">Save PNG</span>
        </button>
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
                <Check size={14} className="text-urgency-stable" />
                <span className="font-outfit text-[10px] text-urgency-stable font-semibold">Copied!</span>
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
      <div className="w-full p-3 bg-accent/5 border border-accent/15 rounded-xl flex items-start gap-2">
        <span className="shrink-0">🔒</span>
        <p className="font-outfit text-xs text-accent/80 leading-relaxed">
          Secure your code or QR for verification. Present this at the drop-off point.
        </p>
      </div>
    </div>
  );
};
