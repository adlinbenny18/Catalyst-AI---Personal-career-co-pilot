
import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, onFileSelect, selectedFile, accept = ".pdf" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all duration-200 flex flex-col items-center justify-center group
          ${selectedFile ? 'border-indigo-500 bg-indigo-500/5' : 'border-[#30363D] hover:border-indigo-500 hover:bg-[#161B22]'}`}
      >
        <input 
          type="file" 
          ref={inputRef}
          className="hidden" 
          accept={accept}
          onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-sm text-gray-200 font-medium truncate max-w-xs">{selectedFile.name}</span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-500 group-hover:text-indigo-500 mb-2" />
            <span className="text-sm text-gray-500 group-hover:text-gray-300">Click to upload PDF</span>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
