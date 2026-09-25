import React, { useState } from 'react';
import { SQL_DUMP_CONTENT, PHP_DB_CONNECT_CODE } from '../data/sqlContent';
import {
  X,
  Database,
  Download,
  Copy,
  Check,
  Server,
  Play,
  Terminal,
  FolderTree,
  AlertCircle,
  ExternalLink,
  Code,
} from 'lucide-react';

interface XamppInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XamppInstallGuideModal: React.FC<XamppInstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPhp, setCopiedPhp] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'step_by_step' | 'sql' | 'php'>('step_by_step');

  // Test live connection
  const [testApiUrl, setTestApiUrl] = useState('http://localhost/e-moment/api/products.php');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [testResult, setTestResult] = useState<string>('');

  if (!isOpen) return null;

  const handleDownloadSql = () => {
    const blob = new Blob([SQL_DUMP_CONTENT], { type: 'application/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'emoment_db.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_DUMP_CONTENT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyPhp = () => {
    navigator.clipboard.writeText(PHP_DB_CONNECT_CODE);
    setCopiedPhp(true);
    setTimeout(() => setCopiedPhp(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus('loading');
    setTestResult('');
    try {
      const res = await fetch(testApiUrl, { method: 'GET' });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setTestStatus('success');
        setTestResult(
          `Koneksi Berhasil! Ditemukan ${data.data?.length || 0} produk dari database MySQL XAMPP.`
        );
      } else {
        setTestStatus('failed');
        setTestResult(data.message || 'Respon server tidak berhasil.');
      }
    } catch (err: any) {
      setTestStatus('failed');
      setTestResult(
        `Koneksi gagal (${err.message}). Pastikan Apache & MySQL di XAMPP sudah di-START dan URL benar.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#1E1B18]/15 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#1E1B18]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8B5A2B] uppercase tracking-wider block">
                Deployment & Integrasi Database Lokal
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18]">
                Panduan Instalasi XAMPP & Database MySQL
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#1E1B18]/50 hover:text-[#1E1B18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-[#1E1B18]/10 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('step_by_step')}
            className={`py-3 text-center cursor-pointer transition-colors ${
              activeTab === 'step_by_step'
                ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
                : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
            }`}
          >
            1. Langkah Instalasi XAMPP
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 text-center cursor-pointer transition-colors ${
              activeTab === 'sql'
                ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
                : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
            }`}
          >
            2. File Script SQL (emoment_db.sql)
          </button>
          <button
            onClick={() => setActiveTab('php')}
            className={`py-3 text-center cursor-pointer transition-colors ${
              activeTab === 'php'
                ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
                : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
            }`}
          >
            3. Kode Backend PHP & API
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: STEP BY STEP GUIDE */}
          {activeTab === 'step_by_step' && (
            <div className="space-y-6 text-xs text-[#1E1B18]">
              
              {/* Step 1 */}
              <div className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E1B18] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h3 className="font-bold text-sm text-[#1E1B18]">
                    Buka XAMPP Control Panel & Start Apache + MySQL
                  </h3>
                </div>
                <p className="text-[#1E1B18]/70 pl-8 leading-relaxed">
                  Buka aplikasi <strong>XAMPP Control Panel</strong> di komputer/laptop Anda. Klik tombol <strong>Start</strong> pada modul <strong>Apache</strong> dan modul <strong>MySQL</strong> hingga kedua indikator berubah warna menjadi hijau.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E1B18] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h3 className="font-bold text-sm text-[#1E1B18]">
                    Buka phpMyAdmin & Buat Database Baru
                  </h3>
                </div>
                <div className="text-[#1E1B18]/70 pl-8 space-y-1.5 leading-relaxed">
                  <p>1. Buka browser dan akses alamat: <code className="bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#1E1B18]/15 font-mono text-[#8B5A2B]">http://localhost/phpmyadmin</code></p>
                  <p>2. Klik menu <strong>New</strong> (Baru) di bilah navigasi kiri phpMyAdmin.</p>
                  <p>3. Masukkan nama database: <strong className="font-mono text-[#1E1B18]">emoment_db</strong> dan klik <strong>Create</strong>.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E1B18] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h3 className="font-bold text-sm text-[#1E1B18]">
                    Import Skema Database (emoment_db.sql)
                  </h3>
                </div>
                <div className="text-[#1E1B18]/70 pl-8 space-y-3">
                  <p>
                    Download atau salin file SQL yang sudah kami siapkan lengkap dengan tabel <code>users</code>, <code>products</code>, <code>orders</code>, <code>order_items</code>, dan <code>shop_settings</code>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleDownloadSql}
                      className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#72481F] text-white font-semibold rounded flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download emoment_db.sql</span>
                    </button>
                    <button
                      onClick={handleCopySql}
                      className="px-4 py-2 bg-white border border-[#1E1B18]/20 hover:bg-[#FAF9F6] text-[#1E1B18] font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Tersalin!' : 'Salin Kode SQL'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#1E1B18]/60">
                    Di phpMyAdmin: Pilih database <strong>emoment_db</strong> &rarr; Klik tab <strong>Import</strong> &rarr; Pilih file <code>emoment_db.sql</code> &rarr; Klik <strong>Go / Kirim</strong>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E1B18] text-white flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h3 className="font-bold text-sm text-[#1E1B18]">
                    Letakkan File Proyek di Folder htdocs XAMPP
                  </h3>
                </div>
                <div className="text-[#1E1B18]/70 pl-8 space-y-2 leading-relaxed">
                  <p>Buat folder baru di direktori instalasi XAMPP Anda:</p>
                  <div className="bg-[#FAF9F6] p-2.5 rounded border border-[#1E1B18]/15 font-mono text-[11px] text-[#1E1B18]">
                    C:\xampp\htdocs\e-moment\
                  </div>
                  <p>
                    Salin folder <code>backend_xamp/</code> ke <code>C:\xampp\htdocs\e-moment\</code> sehingga struktur menjadi:
                  </p>
                  <pre className="bg-[#1E1B18] text-[#FAF9F6] p-3 rounded font-mono text-[11px] leading-tight overflow-x-auto">
{`C:/xampp/htdocs/e-moment/
  ├── config/
  │    └── database.php
  ├── api/
  │    ├── products.php
  │    ├── orders.php
  │    ├── auth.php
  │    └── settings.php
  └── .htaccess`}
                  </pre>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E1B18] text-white flex items-center justify-center font-bold text-xs">
                    5
                  </span>
                  <h3 className="font-bold text-sm text-[#1E1B18]">
                    Menjalankan Frontend React
                  </h3>
                </div>
                <div className="text-[#1E1B18]/70 pl-8 space-y-2 leading-relaxed">
                  <p><strong>Opsi A (Build Statis untuk Apache XAMPP):</strong></p>
                  <p>Jalankan perintah berikut di terminal folder proyek:</p>
                  <div className="bg-[#FAF9F6] p-2 rounded border border-[#1E1B18]/15 font-mono text-[11px]">
                    npm run build
                  </div>
                  <p>Lalu salin seluruh isi folder <code>dist/*</code> ke <code>C:\xampp\htdocs\e-moment\</code>. Buka browser di <strong className="font-mono text-[#8B5A2B]">http://localhost/e-moment</strong>.</p>
                  
                  <p className="pt-1"><strong>Opsi B (Mode Development dengan Vite):</strong></p>
                  <div className="bg-[#FAF9F6] p-2 rounded border border-[#1E1B18]/15 font-mono text-[11px]">
                    npm run dev
                  </div>
                  <p>Akses di <code>http://localhost:3000</code>.</p>
                </div>
              </div>

              {/* Step 6: Live API Tester */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-bold text-sm text-emerald-900">
                    6. Uji Koneksi API MySQL XAMPP Secara Langsung
                  </h3>
                </div>
                <p className="text-xs text-emerald-800">
                  Uji apakah server Apache & MySQL lokal Anda sudah menyala dan dapat merespons permintaan data:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testApiUrl}
                    onChange={(e) => setTestApiUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-emerald-300 rounded font-mono outline-none"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={testStatus === 'loading'}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {testStatus === 'loading' ? 'Mengecek...' : 'Tes Koneksi'}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded text-xs border font-medium ${
                      testStatus === 'success'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-rose-100 border-rose-300 text-rose-900'
                    }`}
                  >
                    {testResult}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SQL SCRIPT VIEW */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1E1B18]">
                    File: database/emoment_db.sql
                  </h3>
                  <p className="text-xs text-[#1E1B18]/60">
                    Skema database MySQL lengkap siap import ke phpMyAdmin.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadSql}
                    className="px-3 py-1.5 bg-[#8B5A2B] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .SQL</span>
                  </button>
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 bg-white border border-[#1E1B18]/20 text-xs font-semibold rounded flex items-center gap-1.5"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <pre className="bg-[#1E1B18] text-[#FAF9F6] p-4 rounded-lg font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto">
                {SQL_DUMP_CONTENT}
              </pre>
            </div>
          )}

          {/* TAB 3: PHP CONNECTION VIEW */}
          {activeTab === 'php' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1E1B18]">
                    File: backend_xamp/config/database.php
                  </h3>
                  <p className="text-xs text-[#1E1B18]/60">
                    Koneksi PDO MySQL untuk Apache XAMPP dengan dukungan CORS.
                  </p>
                </div>
                <button
                  onClick={handleCopyPhp}
                  className="px-3 py-1.5 bg-[#8B5A2B] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs"
                >
                  {copiedPhp ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhp ? 'Tersalin' : 'Salin Kode PHP'}</span>
                </button>
              </div>

              <pre className="bg-[#1E1B18] text-[#FAF9F6] p-4 rounded-lg font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto">
                {PHP_DB_CONNECT_CODE}
              </pre>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Lokasi File di Komputer Anda:</span>
                <p>Salin file ini ke: <code>C:\xampp\htdocs\e-moment\config\database.php</code></p>
                <p>Jika password database MySQL XAMPP Anda bukan kosong, sesuaikan variabel <code>$password = "password_anda";</code> di baris tersebut.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#1E1B18]/10 flex justify-between items-center text-xs">
          <span className="text-[#1E1B18]/50">
            Dibuat untuk integrasi mulus dengan XAMPP v7.4 / v8.x
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E1B18] text-[#FAF9F6] font-semibold rounded hover:bg-[#2C2723]"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
