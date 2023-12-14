import * as client from "./client";
import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./publicuser.css";

function PublicUser() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [likedAnimeList, setLikedAnimeList] = useState([]);
  const navigate = useNavigate();

  const fetchPublicUser = useCallback(async () => {
    try {
      const updatedAccount = await client.account();
      setAccount(updatedAccount);
      
      const publicUser = await client.findUserById(userId);
      setUser(publicUser);

      const reviews = await client.findUserReviews(publicUser);
      setUserReviews(reviews);

      const animeImages = await Promise.all(
        reviews.map((review) => client.getAnime(review.animeId))
      );
      setAnimeImages(animeImages.map((animeData) => animeData.imageUrl));

      const likedAnime = await Promise.all(
        publicUser.likedAnime.map((animeId) => client.getAnime(animeId))
      );
      setLikedAnimeList(likedAnime.map((animeData) => animeData.imageUrl));
    } catch (error) {
      console.error("Error fetching public user details:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchPublicUser();
  }, [fetchPublicUser]);


  const handleSignout = async () => {
    try {
      await client.signout();
      setAccount(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  return (
    <div className="public-user-container">
      <div>
      {account ? `User: ${account.username}` : 'Anonymous User'}
      </div>
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
        <Link onClick={handleSignout} className="nav-link">
          {account ? "Sign Out" : "Sign In"}
        </Link>
      </div>
      <div className="profile-section">
        <h1>Public Profile</h1>
        {user && (
          <div>
            <div className="profile-field">
              <span>Username:</span>
              <p>{user.username}</p>
            </div>
            <div className="profile-field">
              <span>First Name:</span>
              <p>{user.firstName}</p>
            </div>
            <div className="profile-field">
              <span>User Type:</span>
              <p>{user.role}</p>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="liked-anime-section">
        <h2>Liked Anime</h2>
        <div className="liked-anime-cards">
          {likedAnimeList.map((imageUrl, index) => (
            <div key={index} className="liked-anime-card">
              {}
              <Link to={`/details/${user.likedAnime[index]}`}>
                <img src={imageUrl} alt={`Liked Anime ${index + 1}`} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="public-user-reviews-section">
        <h2>User Reviews</h2>
        <div className="liked-anime-cards">
          {userReviews.map((review, index) => (
            <div key={review._id} className="liked-anime-card">
              {}
              <Link to={`/details/${review.animeId}`}>
                <img src={animeImages[index]} alt={`Anime ${review.animeId}`} />
              </Link>
              <p>{review.reviewText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicUser;
