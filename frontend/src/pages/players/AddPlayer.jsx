import React, { useState, useEffect } from 'react';
import { useAddPlayerMutation } from '../redux/api/userApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddPlayer.css';

const AddPlayer = () => {
  const [formData, setFormData] = useState({playerId: '',name: '',email: '',phone: '',fees: '',});
  
  const [loadingScreen, setLoadingScreen] = useState(true);
  const navigate = useNavigate();
  const [addPlayer, { isLoading }] = useAddPlayerMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPlayer(formData).unwrap();
      toast.success('Player added successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add player');
    }
  };

  return (
    <section className="addPlayerBlock">
      {loadingScreen && (
        <div className="initial-loading-screen">
          <div className="loader-circle"></div>
          <p className="loading-text">Loading Add Player...</p>
        </div>
      )}

      <div className="video-wrapper">
        <video autoPlay muted loop className="video-background" playsInline>
          <source src="/videos/footballer.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="addPlayerContainer">
        <h1 className="addPlayerTitle">Add New Player</h1>
        <form className="formContainer" onSubmit={handleSubmit}>
          {['playerId', 'name', 'email', 'phone', 'fees'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="addPlayerLabel">{field}</label>
              <input
                type={field === 'fees' ? 'number' : 'text'}
                name={field}
                id={field}
                className="addPlayerInput"
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
          ))}
          <button type="submit" className="submitPlayerButton" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Player'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddPlayer;
