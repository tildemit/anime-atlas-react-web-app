import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchAnimeRecommendations = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/anime/1/recommendations');
        const data = await response.json();
        setRecommendations(data.data || []);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
      }
    };

    fetchAnimeRecommendations();
  }, []);

  return (
    <div className="home-container">
      <div className="top-bar">
        <Link to="/profile" className="nav-link">Account</Link>
        <Link to="/search" className="nav-link">Search</Link>
        <Link to="/signin" className="nav-link">Sign In</Link>
      </div>

      <div className="header">
        <h1>Welcome to AnimeAtlas!</h1>
        <p>Discover and explore anime here.</p>
      </div>

      <div className="anime-scroll">
        {recommendations.map((recommendation) => (
          <div className="anime-card" key={recommendation.entry.mal_id}>
            <img
              src={recommendation.entry.images.jpg.image_url}
              alt={recommendation.entry.title}
            />
            <p>{recommendation.entry.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
