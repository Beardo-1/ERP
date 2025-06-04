import React, { useRef, useState } from 'react';

function parseCSV(text: string) {
  const lines = text.split('\n').filter(Boolean);
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
  return { headers, rows };
}

const SalesModule: React.FC = () => {
  const [data, setData] = useState<{ headers: string[]; rows: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setData(parseCSV(text));
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Sales Module</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => fileInputRef.current?.click()}
        >
          Import CSV
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImport}
        />
      </div>
      {data ? (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {data.headers.map((h) => (
                  <th key={h} className="px-4 py-2 bg-gray-100 border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i}>
                  {data.headers.map((h) => (
                    <td key={h} className="px-4 py-2 border-b">{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No data uploaded. Click "Import CSV" to upload sales data.</div>
      )}
    </div>
  );
};

export default SalesModule; 