// Details.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Details = () => {
  const { animeId } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        // Fetch anime details using the Jikan API with the specific animeId
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        setAnimeDetails(data.data || null);

        // Fetch anime characters using the Jikan API with the specific animeId
        const charactersResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        const charactersData = await charactersResponse.json();
        // Filter main characters
        const mainCharacters = charactersData.data.filter((character) => character.role === 'Main');
        setCharacters(mainCharacters);

        // Fetch anime videos using the Jikan API with the specific animeId
        const videosResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/videos`);
        const videosData = await videosResponse.json();
        setVideos(videosData.data.promo || []);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  if (!animeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <h1>{animeDetails.title}</h1>
      <img src={animeDetails.images.jpg.large_image_url} alt={animeDetails.title} style={{ width: '300px', marginRight: '10px' }}/>
      <p>{animeDetails.synopsis}</p>

      {characters.length > 0 && (
        <div className="characters-section">
          <h2>Main Characters</h2>
          <ul className="characters-list">
            {characters.map((character) => (
              <li key={character.character.mal_id}>
                <img src={character.character.images.jpg.image_url} alt={character.character.name} style={{ width: '150px', marginRight: '10px' }}/>
                <p>{character.character.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

{videos.length > 0 && (
  <div className="videos-section">
    <h2>Videos</h2>
    <ul className="videos-list">
      {videos
        .filter((video) => video.title.toLowerCase().includes('trailer') || video.title.toLowerCase().includes('pv'))
        .reverse() // Reverse the array
        .slice(0, 2)
        .map((video) => (
          <li key={video.title}>
            <p>{video.title}</p>
            <iframe
              title={video.title}
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.trailer.youtube_id}`}
              allowFullScreen
            ></iframe>
          </li>
        ))}
    </ul>
  </div>
)}







      {/* Add more details as needed */}
    </div>
  );
};

export default Details;
