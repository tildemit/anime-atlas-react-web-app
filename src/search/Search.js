import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Search.css";
import * as client from "./client";

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchResults, setSearchResults] = useState([]);
  const [userAccount, setUserAccount] = useState(null);
  const isInitialMount = useRef(true);

  const fetchAnime = async (query) => {
    try {
      if (query.trim() !== "") {
        const response = await axios.get(
          `https://api.jikan.moe/v4/anime?q=${query}&sfw&genres_exclude=9,12,49`
        );
        setSearchResults(response.data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching for anime:", error);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (query) {
        fetchAnime(query);
      }
    }
  }, [query]);

  useEffect(() => {
    const fetchUserAccount = async () => {
      const account = await client.account();
      setUserAccount(account);
    };

    fetchUserAccount();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      await fetchAnime(searchQuery);

      if (searchQuery.trim() !== "") {
        navigate(`/search/${searchQuery}`);
      } else {
        navigate("/search");
      }
    } catch (error) {
      console.error("Error searching for anime:", error);
    }
  };

  const handleSignout = async () => {
    try {
      await client.signout();

      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link
          to={userAccount ? "/signin" : "/signin"}
          className="nav-link"
          onClick={userAccount ? handleSignout : null}
        >
          {userAccount ? "Signout" : "Signin"}
        </Link>
      </div>

      <div className="header">
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
      </div>

      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul className="anime-scroll">
            {searchResults.map((anime) => (
              <li key={anime.mal_id} className="anime-card">
                <Link to={`/details/${anime.mal_id}`}>
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ width: "300px" }}
                  />
                  <p className="anime-title">{anime.title}</p>
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
