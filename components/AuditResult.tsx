import React from 'react';
import { AuditData } from '../types';
import { generatePDF } from '../services/pdfGenerator';
import { CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react';

interface AuditResultProps {
  data: AuditData;
  onReset: () => void;
}

const AuditResult: React.FC<AuditResultProps> = ({ data, onReset }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 50) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl mx-auto text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Audit Results</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">@{data.username}</p>

      <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center rounded-full border-8 transition-all duration-1000 ease-out"
           style={{ borderColor: 'currentColor' }}>
         <div className={`w-full h-full rounded-full flex items-center justify-center border-4 border-transparent ${getScoreColor(data.score)}`}>
            <div className="text-center">
                <span className="text-5xl font-black block">{data.score}</span>
                <span className="text-sm font-medium opacity-75 uppercase">Score</span>
            </div>
         </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-left mb-8">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Suggestions</h3>
        {data.suggestions.length > 0 ? (
          <ul className="space-y-3">
            {data.suggestions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 text-green-500 font-medium">
            <CheckCircle size={20} />
            <span>Perfect Audit! No suggestions.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => generatePDF(data)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Download size={20} />
          Download PDF Report
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RefreshCw size={20} />
          Audit Another Account
        </button>
      </div>
    </div>
  );
};

export default AuditResult;