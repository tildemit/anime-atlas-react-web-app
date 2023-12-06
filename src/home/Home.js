import React, { useState, useEffect } from 'react';
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
      <div className="header">
        <h1>Welcome to Our Anime App!</h1>
        <p>Discover and explore anime recommendations here.</p>
      </div>

      <div className="anime-scroll">
        {recommendations.map((recommendation) => (
          <div className="anime-card" key={recommendation.entry.mal_id}>
            <img
              src={recommendation.entry.images.jpg.large_image_url}
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
