import React from 'react';

const CanvasOAuthButton = ({ oauthUrl }) => {
  const handleLogin = () => {
    window.location.href = oauthUrl;
  };

  return (
    <button onClick={handleLogin} style={{ padding: '10px', backgroundColor: '#0079bf', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Connect with Canvas
    </button>
  );
};

export default CanvasOAuthButton;