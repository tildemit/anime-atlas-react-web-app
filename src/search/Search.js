import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [searchResults, setSearchResults] = useState([]);
  const isInitialMount = useRef(true);

  const fetchAnime = async (query) => {
    try {
      if (query.trim() !== '') {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&sfw&genres_exclude=9,12,49`);
        setSearchResults(response.data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for anime:', error);
    }
  };

  useEffect(() => {
    // Perform the search only on page refresh
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (query) {
        fetchAnime(query);
      }
    }
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      await fetchAnime(searchQuery);

      // Update the URL with the search query
      if (searchQuery.trim() !== '') {
        navigate(`/search/${searchQuery}`);
      } else {
        // If the search query is empty, navigate to the base search URL
        navigate('/search');
      }
    } catch (error) {
      console.error('Error searching for anime:', error);
    }
  };

  return (
    <div className="container">
      <h1>Anime Search</h1>
      <form onSubmit={handleSearch}>
        <label>
          Search by Name:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul className="anime-list">
            {searchResults.map((anime) => (
              <li key={anime.mal_id}>
                <Link to={`/details/${anime.mal_id}`}>
                  <img src={anime.images.jpg.image_url} alt={anime.title} />
                  <p>{anime.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
