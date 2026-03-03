// ============ UTILITY FUNCTIONS ============

// Format currency to INR
export const formatINR = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (10 digits)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Calculate discount percentage
export const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get time ago string
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

// Local storage helpers with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Share product via Web Share API
export const shareProduct = async (product) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on FIT ZONE!`,
        url: window.location.href
      });
      return { success: true };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return { success: false, error };
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      return { success: true, fallback: true };
    } catch (error) {
      return { success: false, error };
    }
  }
};

// Download data as JSON file
export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download data as CSV file
export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if PWA is installed
export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Show notification
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options
    });
  }
};

// Lazy load images
export const lazyLoadImage = (img) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add('loaded');
          observer.unobserve(image);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = img.dataset.src;
  }
};

// Apply coupon code
export const applyCoupon = (code, total) => {
  const coupons = {
    'FITZONE10': { type: 'percentage', value: 10, minOrder: 1000 },
    'FITZONE20': { type: 'percentage', value: 20, minOrder: 2000 },
    'WELCOME50': { type: 'fixed', value: 50, minOrder: 500 },
    'NEWYEAR100': { type: 'fixed', value: 100, minOrder: 1500 },
    'FREESHIP': { type: 'shipping', value: 0, minOrder: 0 }
  };
  
  const coupon = coupons[code.toUpperCase()];
  
  if (!coupon) {
    return { success: false, message: 'Invalid coupon code' };
  }
  
  if (total < coupon.minOrder) {
    return { 
      success: false, 
      message: `Minimum order of ${formatINR(coupon.minOrder)} required` 
    };
  }
  
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (total * coupon.value) / 100;
  } else if (coupon.type === 'fixed') {
    discount = coupon.value;
  }
  
  return {
    success: true,
    discount,
    type: coupon.type,
    message: `Coupon applied! You saved ${formatINR(discount)}`
  };
};

// Product recommendation algorithm
export const getRecommendations = (currentProduct, allProducts, limit = 4) => {
  return allProducts
    .filter(p => p._id !== currentProduct._id)
    .filter(p => p.category === currentProduct.category || p.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Calculate estimated delivery date
export const getEstimatedDelivery = (days = 5) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};
