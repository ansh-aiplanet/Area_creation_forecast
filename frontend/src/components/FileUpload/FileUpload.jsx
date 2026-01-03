import { useRef, useState } from 'react'
import './FileUpload.css'

function FileUpload({ onFileSelect }) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && file.name.endsWith('.csv')) {
            setSelectedFile(file)
            onFileSelect?.(file)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            onFileSelect?.(file)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="file-upload-section">
            <h4 className="file-upload-title">Upload Products CSV</h4>
            <div
                className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                />
                <div className="file-upload-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 22V10M16 10L12 14M16 10L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 22V24C6 25.1046 6.89543 26 8 26H24C25.1046 26 26 25.1046 26 24V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {selectedFile ? (
                    <div className="file-selected">
                        <span className="file-name">{selectedFile.name}</span>
                        <button
                            className="file-remove"
                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="file-upload-text">
                            <span className="file-upload-link">Click to upload</span> or drag and drop
                        </p>
                        <p className="file-upload-hint">CSV files only</p>
                    </>
                )}
            </div>
            <p className="file-upload-columns">
                <span className="text-muted">Required columns:</span> Production area, Vacant lot, Passage, People gathering...<br></br>
                <span className="text-muted">Required rows:</span> FY24, FY25
            </p>
        </div>
    )
}

export default FileUpload
