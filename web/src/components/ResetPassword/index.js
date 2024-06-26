import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../../imgs/logos/close.png';
import ponteLogo from '../../imgs/logos/logoponte.png';
import './Reset.css';

function ResetPassword({ isOpen, onClose, token }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`https://wheretogo-4kxz.onrender.com/verify-reset-token?token=${token}`);
        if (response.ok) {
          setIsValidToken(true);
          navigate('/reset-password', { replace: true }); // Remover o token da URL
        } else {
          const data = await response.json();
          setMessage(data.error || 'Invalid or expired token.');
          setIsValidToken(false);
        }
      } catch (error) {
        setMessage('Error verifying token.');
        setIsValidToken(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://wheretogo-4kxz.onrender.com/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        setMessage('Password reset successful!');
        window.location.href = '/';
      } else {
        setMessage('Error resetting password.');
      }
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };

  if (!isOpen || !isValidToken) return null;
  return (
    <div className="reset-password-container" onClick={onClose}>
      <div className="password-container" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="reset-close-button">
          <img src={closeIcon} alt="Close" />
        </button>
        <div className="password-header">
          <img src={ponteLogo} alt="Ponte" className="ponte-logo" />
          <h3><b>Reset your password</b></h3>
        </div>

        <form className="password-form" onSubmit={handleSubmit}>
          <div className='container-password'>
            <label htmlFor="newPassword">New Password</label>
            <input
              className="txt"
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className='container-password'>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="txt"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button className="but-reset" type="submit">Reset</button>
          </div>
        </form>
        {message && <p>{message}</p>}
        <div className="reset-terms">
          <p>By proceeding, you agree to our Terms of Use and confirm you have read our Privacy and Cookie Statement</p>
          <p>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;