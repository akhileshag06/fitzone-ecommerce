import { useState, useEffect } from 'react';
import { isPWAInstalled } from '../utils/helpers';

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (isPWAInstalled()) {
      return;
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-content">
        <div className="pwa-icon">📱</div>
        <div className="pwa-text">
          <h4>Install FIT ZONE App</h4>
          <p>Get quick access and offline support</p>
        </div>
        <div className="pwa-actions">
          <button onClick={handleInstall} className="install-btn">Install</button>
          <button onClick={handleDismiss} className="dismiss-btn">✕</button>
        </div>
      </div>

      <style>{`
        .pwa-install-prompt {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .pwa-content {
          background: rgba(18, 22, 30, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 183, 77, 0.3);
          border-radius: 50px;
          padding: 15px 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          max-width: 90vw;
        }

        .pwa-icon {
          font-size: 32px;
        }

        .pwa-text h4 {
          color: white;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .pwa-text p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .pwa-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .install-btn {
          padding: 8px 20px;
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          border: none;
          border-radius: 25px;
          color: #0a0c10;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .install-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 183, 77, 0.3);
        }

        .dismiss-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dismiss-btn:hover {
          background: rgba(255, 107, 107, 0.2);
          border-color: #ff6b6b;
        }

        @media (max-width: 768px) {
          .pwa-install-prompt {
            bottom: 10px;
            left: 10px;
            right: 10px;
            transform: none;
          }

          .pwa-content {
            width: 100%;
            padding: 12px 20px;
          }

          .pwa-icon {
            font-size: 28px;
          }

          .pwa-text h4 {
            font-size: 13px;
          }

          .pwa-text p {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

export default PWAInstallPrompt;
