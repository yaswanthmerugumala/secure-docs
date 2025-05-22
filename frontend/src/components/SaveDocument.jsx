import React, { useState } from 'react';
import axios from 'axios';

function SaveDocument() {
  const [keyword, setKeyword] = useState('');
  const [document, setDocument] = useState(null);
  const [format, setFormat] = useState('binary');

  const handleSave = async (e) => {
    e.preventDefault();

    if (!document || !keyword) {
      alert('Please fill in the keyword and select a document.');
      return;
    }

    const formData = new FormData();
    formData.append('keyword', keyword);
    formData.append('document', document);
    formData.append('format', format);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not authenticated. Please login again.');
        return;
      }

      const res = await axios.post('http://localhost:5000/api/documents/save', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message);
    } catch (err) {
      alert('Error saving document. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Save Document</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Keyword</label>
          <input
            type="text"
            className="form-control"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Document</label>
          <input
            type="file"
            className="form-control"
            accept=".txt,.pdf,.docx,.jpg,.png"
            onChange={(e) => setDocument(e.target.files[0])}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Document Format</label>
          <select
            className="form-control"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="binary">Binary (.pdf, .docx, .jpg, .png)</option>
            <option value="text">Text (.txt, .html)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Document
        </button>
      </form>
    </div>
  );
}

export default SaveDocument;
