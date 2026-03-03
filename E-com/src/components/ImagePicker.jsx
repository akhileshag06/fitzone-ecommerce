import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ImagePicker({ onSelect, currentImage, token }) {
  const [showPicker, setShowPicker] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(currentImage || '');
  const [inputMethod, setInputMethod] = useState('url'); // 'url' or 'upload' or 'gallery'

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (showPicker && inputMethod === 'gallery') {
      fetchImages();
    }
  }, [showPicker, inputMethod]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/upload`, { headers });
      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setSelectedImage(res.data.imageUrl);
        onSelect(res.data.imageUrl);
        alert('✅ Image uploaded successfully!');
        setTimeout(() => {
          setShowPicker(false);
        }, 500);
      }
    } catch (error) {
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input for next upload
    }
  };

  const handleSelectFromGallery = (imageUrl) => {
    setSelectedImage(imageUrl);
    onSelect(imageUrl);
    setShowPicker(false);
  };

  const handleUrlSubmit = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      setShowPicker(false);
    }
  };

  return (
    <div>
      {/* Image Preview & Open Button */}
      <div style={{ marginBottom: '10px' }}>
        {selectedImage && (
          <div style={{
            width: '100%',
            height: '150px',
            borderRadius: '15px',
            background: 'linear-gradient(145deg, #2d3342, #1f232e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            padding: '10px'
          }}>
            <img 
              src={selectedImage} 
              alt="Product" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '10px' }}
              onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image'}
            />
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPicker(true);
          }}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,183,77,0.1)',
            border: '1px solid rgba(255,183,77,0.3)',
            borderRadius: '25px',
            color: '#ffb74d',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          📷 {selectedImage ? 'Change Image' : 'Select Image'}
        </button>
      </div>

      {/* Image Picker Modal */}
      {showPicker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(18,22,30,0.98)',
            border: '1px solid rgba(255,183,77,0.3)',
            borderRadius: '35px',
            padding: '35px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPicker(false);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              ✕
            </button>

            <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '22px' }}>
              📷 Select <span style={{ color: '#ffb74d' }}>Product Image</span>
            </h2>

            {/* Method Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
              {[
                { key: 'url', icon: '🔗', label: 'Image URL' },
                { key: 'upload', icon: '📤', label: 'Upload New' },
                { key: 'gallery', icon: '🖼️', label: 'Gallery' }
              ].map(method => (
                <button
                  key={method.key}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setInputMethod(method.key);
                  }}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: '12px 15px',
                    background: inputMethod === method.key ? 'rgba(255,183,77,0.15)' : 'transparent',
                    border: inputMethod === method.key ? '1px solid #ffb74d' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '25px',
                    color: inputMethod === method.key ? '#ffb74d' : 'rgba(255,255,255,0.6)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {method.icon} {method.label}
                </button>
              ))}
            </div>

            {/* URL Input */}
            {inputMethod === 'url' && (
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  IMAGE URL
                </label>
                <input
                  type="url"
                  value={selectedImage}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg or http://localhost:5000/images/product.png"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '25px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '15px'
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUrlSubmit();
                  }}
                  disabled={!selectedImage}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: selectedImage ? 'linear-gradient(135deg,#ffb74d,#ff8a5c)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '40px',
                    color: selectedImage ? '#0a0c10' : 'rgba(255,255,255,0.3)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: selectedImage ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s'
                  }}
                >
                  ✅ Use This URL
                </button>
              </div>
            )}

            {/* Upload New */}
            {inputMethod === 'upload' && (
              <div>
                <div style={{
                  border: '2px dashed rgba(255,183,77,0.3)',
                  borderRadius: '20px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'rgba(255,183,77,0.05)',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📤</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '15px' }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '20px' }}>
                    PNG, JPG, GIF, WEBP up to 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                    id="file-upload-input"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      document.getElementById('file-upload-input').click();
                    }}
                    disabled={uploading}
                    style={{
                      display: 'inline-block',
                      padding: '12px 30px',
                      background: uploading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#ffb74d,#ff8a5c)',
                      border: 'none',
                      borderRadius: '30px',
                      color: uploading ? 'rgba(255,255,255,0.3)' : '#0a0c10',
                      fontWeight: 700,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {uploading ? '⏳ Uploading...' : '📁 Choose File'}
                  </button>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>
                  💡 Tip: Images will be saved in Backend/public/images folder
                </p>
              </div>
            )}

            {/* Gallery */}
            {inputMethod === 'gallery' && (
              <div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                    Loading gallery...
                  </div>
                ) : images.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🖼️</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No images in gallery yet</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '10px' }}>
                      Upload your first image using the "Upload New" tab
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '15px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '10px'
                  }}>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectFromGallery(img.url)}
                        style={{
                          width: '100%',
                          height: '120px',
                          borderRadius: '15px',
                          background: 'linear-gradient(145deg, #2d3342, #1f232e)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '10px',
                          cursor: 'pointer',
                          border: selectedImage === img.url ? '2px solid #ffb74d' : '2px solid transparent',
                          transition: 'all 0.3s',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <img
                          src={img.url}
                          alt={img.filename}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '10px'
                          }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/120?text=Error'}
                        />
                        {selectedImage === img.url && (
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#ffb74d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
