import React, { useState, useEffect } from "react";
import * as client from "./client";
import { useParams } from "react-router-dom";
import "./CharacterDetails.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CharacterDetails = () => {
  const { characterId } = useParams();
  const [characterDetails, setCharacterDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const data = await client.getCharacterDetails(characterId);
        setCharacterDetails(data.data || null);

        const userAccount = await client.account();
        setUser(userAccount);

        if (userAccount?.likedCharacters?.includes(characterId)) {
          setIsLiked(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching character details:", error);
        setLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [characterId]);

  const handleLikeCharacter = async () => {
    try {
      if (!user || user.role === "BASIC") {
        alert("Please sign in or upgrade your account to like characters.");
        return;
      }

      const newLikeStatus = !isLiked;

      if (newLikeStatus) {
        await client.likeCharacter(characterId, user._id);
        await client.addCharacter({
          characterId: characterDetails.mal_id.toString(),
          imageUrl: characterDetails.images.jpg.image_url,
        });
      } else {
        await client.unlikeCharacter(characterId, user._id);
      }

      setIsLiked(newLikeStatus);
    } catch (error) {
      console.error("Error handling like/unlike character:", error);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role === "BASIC" || !characterDetails) {
    return (
      <div>
        <p>Please upgrade your account to view character details.</p>
        <Link to="/profile">Profile</Link>
        {}
      </div>
    );
  }

  return (
    <div className="character-details-container">
      <div className="top-bar">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/search" className="nav-link">
          Search
        </Link>
        <Link
          to={user ? "/signin" : "/signin"}
          className="nav-link"
          onClick={user ? handleSignout : null}
        >
          {user ? "Signout" : "Signin"}
        </Link>
      </div>
      <button
        onClick={handleLikeCharacter}
        style={{
          width: "50px",
          marginTop: "40px",
          background: "none",
          color: isLiked ? "red" : "white",
        }}
      >
        {isLiked ? "❤️" : "🩶"}
      </button>

      <h1>{characterDetails.name}</h1>
      <img
        src={characterDetails.images.jpg.image_url}
        alt={characterDetails.name}
        style={{ width: "300px", marginRight: "10px" }}
      />

      <h2>About</h2>
      <p style={{ textAlign: "left" }}>{characterDetails.about}</p>

      {}
    </div>
  );
};

export default CharacterDetails;
