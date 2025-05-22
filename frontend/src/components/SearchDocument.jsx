import React, { useState } from 'react';
import axios from 'axios';

function SearchDocument() {
  const [keyword, setKeyword] = useState('');
  const [document, setDocument] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/documents/verify',
        { keyword },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        }
      );

      const contentType = res.headers['content-type'];

      if (contentType.includes('text')) {
        const decryptedText = new TextDecoder().decode(new Uint8Array(res.data));
        setDocument(decryptedText);
        setFileUrl(null);
      } else {
        const blob = new Blob([res.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setDocument('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Document not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Secure Document Search</h2>
      <form onSubmit={handleSearch}>
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Document'}
        </button>
      </form>

      {document && (
        <div className="mt-4">
          <h4>Decrypted Document:</h4>
          <pre>{document}</pre>
        </div>
      )}

      {fileUrl && (
        <div className="mt-4">
          <h4>Download Document:</h4>
          <a href={fileUrl} download className="btn btn-success">
            Download Document
          </a>
        </div>
      )}
    </div>
  );
}

export default SearchDocument;
