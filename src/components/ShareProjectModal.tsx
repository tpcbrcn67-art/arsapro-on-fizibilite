import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Lock,
  Calendar,
  Download,
  Eye,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SavedFeasibility } from '../types/feasibility';
import { ShareSettings } from '../types/saas';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SavedFeasibility | null;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen || !project) return null;

  // Generate a random 6-character code like 8HD72K
  const [shareCode] = useState<string>(() => {
    return '8HD' + Math.random().toString(36).substring(2, 5).toUpperCase();
  });

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [pinCode, setPinCode] = useState('1453');
  const [expiryDays, setExpiryDays] = useState<'7' | '30' | 'never'>('30');
  const [allowPdfDownload, setAllowPdfDownload] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://arsapro.com/share/${shareCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Proje Paylaş</h2>
              <p className="text-xs text-slate-400">{project.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Share Link Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Özel Paylaşım Bağlantısı
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Bağlantıya sahip olan kişiler projeyi yalnızca salt-okunur (sunum formatında) görüntüleyebilir.
            </p>
          </div>

          {/* Privacy & Security Controls */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Erişim &amp; Güvenlik Ayarları</span>
            </div>

            {/* Password Protection */}
            <div className="flex items-start justify-between gap-3 pt-2 border-t border-slate-200/80">
              <div>
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Şifreli Paylaşım (PIN Koruması)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Raporu açmak için 4 haneli PIN kodu istenir.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setIsPasswordProtected(e.target.checked)}
                className="mt-1 h-4 w-4 text-emerald-600 rounded-sm"
              />
            </div>

            {isPasswordProtected && (
              <div className="pl-6 pt-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="PIN: 1453"
                  className="px-3 py-1.5 text-xs font-mono font-bold tracking-widest border border-slate-300 rounded-lg w-32 bg-white"
                />
              </div>
            )}

            {/* Expiry */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
              <div>
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Link Süresi</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Süre bitiminde bağlantı otomatik olarak geçersiz kılınır.
                </p>
              </div>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value as any)}
                className="text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              >
                <option value="7">7 Gün</option>
                <option value="30">30 Gün</option>
                <option value="never">Süresiz</option>
              </select>
            </div>

            {/* Download Permission */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
              <div>
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>PDF Raporu İndirme İzni</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Ziyaretçi PDF çıktısı alabilir mi?
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowPdfDownload}
                onChange={(e) => setAllowPdfDownload(e.target.checked)}
                className="h-4 w-4 text-emerald-600 rounded-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Bağlantıyı Kopyala</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
