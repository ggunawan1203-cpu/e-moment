import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
        let borderClass = 'border-emerald-200 bg-white text-emerald-950';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-200 bg-white text-rose-950';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />;
          borderClass = 'border-[#1E1B18]/15 bg-white text-[#1E1B18]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-lg border shadow-lg text-xs transition-all animate-in fade-in slide-in-from-bottom-3 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <span className="font-medium leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded text-black/40 hover:text-black/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
