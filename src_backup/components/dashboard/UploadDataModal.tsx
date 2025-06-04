import React, { useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (data: any[], name: string) => void;
}

export const UploadDataModal: React.FC<UploadDataModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data as any[]);
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        setError('Failed to parse CSV');
        setLoading(false);
      }
    });
  };

  const handleUpload = () => {
    if (data.length === 0 || !name) {
      setError('Please provide a name and upload a CSV file.');
      return;
    }
    onUpload?.(data, name);
    setFile(null);
    setData([]);
    setName('');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
          >
            <button className="absolute top-4 right-4" onClick={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
            <div className="flex items-center mb-6 space-x-3">
              <UploadCloud className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-bold">Upload CSV Data</h2>
            </div>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Dataset Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="file"
              accept=".csv"
              className="mb-4"
              onChange={handleFileChange}
            />
            {loading && <div className="text-blue-500 mb-2">Parsing CSV...</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {data.length > 0 && (
              <div className="mb-4 max-h-40 overflow-auto border rounded bg-gray-50 text-xs">
                <table className="w-full">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="px-2 py-1 border-b text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {Object.keys(row).map((key) => (
                          <td key={key} className="px-2 py-1 border-b">{row[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 5 && <div className="text-gray-400 px-2 py-1">...and {data.length - 5} more rows</div>}
              </div>
            )}
            <button
              className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
              onClick={handleUpload}
              disabled={loading}
            >
              Upload Data
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 