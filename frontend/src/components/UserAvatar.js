// src/components/UserAvatar.js
import React, { useState } from 'react';

const UserAvatar = ({ user, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  // Default to first photo or fallback to initial of display name
  const avatarUrl = user.photos?.[0]?.value;
  const initial = user.displayName?.charAt(0).toUpperCase() || '?';
  
  if (!avatarUrl || imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-blue-600 text-white font-bold ${className}`}
        title={user.displayName || 'User'}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={user.displayName || 'User avatar'}
      onError={() => setImageError(true)}
      className={className}
      loading="lazy"
      title={user.displayName || 'User'}
    />
  );
};

export default UserAvatar; 