import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";
import * as client from "./client";

const Home = () => {
  const [likedAnime, setLikedAnime] = useState([]);
  const [followingReviews, setFollowingReviews] = useState([]);
  const [userAccount, setUserAccount] = useState(null);
  const [recentlyLikedAnime, setRecentlyLikedAnime] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = await client.account();
        setUserAccount(account);

        if (!account) {
          const recentlyLikedAnimeData = await client.getAnimes();
          setRecentlyLikedAnime(recentlyLikedAnimeData.reverse().slice(0, 10));
          const reviewData = await client.getReviews();
          const reviewsWithAnimeData = await Promise.all(
            reviewData.map(async (review) => {
              const anime = await client.getAnime(review.animeId);
              return {
                ...review,
                animeImage: anime.imageUrl,
              };
            })
          );
          setFollowingReviews(reviewsWithAnimeData.reverse());
        } else {
          if (account) {
            const likedAnimeData = await Promise.all(
              account.likedAnime.map((animeId) => client.getAnime(animeId))
            );
            setLikedAnime(
              likedAnimeData.map((animeData) => animeData.imageUrl)
            );
          }

          const followingList = account?.following || [];
          const followingReviewsData = await Promise.all(
            followingList.map(async (userId) => {
              const user = await client.findUserById(userId);
              const reviews = await client.findUserReviews(user);
              const reviewsWithAnimeData = await Promise.all(
                reviews.map(async (review) => {
                  const anime = await client.getAnime(review.animeId);
                  return {
                    ...review,
                    animeImage: anime.imageUrl,
                    reviewerUsername: user.username,
                  };
                })
              );
              return reviewsWithAnimeData;
            })
          );
          setFollowingReviews(followingReviewsData.flat().reverse());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [recentlyLikedAnime]);

  const handleSignout = async () => {
    try {
      await client.signout();
      setUserAccount(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <Link to="/register" className="nav-link">
          Signup
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/search" className="nav-link">
          Search
        </Link>
        <Link onClick={handleSignout} className="nav-link">
          {userAccount ? "Sign Out" : "Sign In"}
        </Link>
      </div>

      <div className="header">
        <h1>Welcome to AnimeAtlas!</h1>
        <p>
    {userAccount ? `Hello, ${userAccount.username}!` : ''}
  </p>
        <p>Explore and discover your new favorite show here, the #1 site for all things anime.</p>
      </div>

      {likedAnime.length > 0 && (
        <div className="liked-anime-scroll">
          <h2>Your Liked Anime</h2>
          <div className="liked-anime-cards">
            {likedAnime.map((imageUrl, index) => (
              <div key={index} className="liked-anime-card">
                <Link to={`/details/${userAccount.likedAnime[index]}`}>
                  <img
                    src={imageUrl}
                    alt={`Liked Anime ${index + 1}`}
                    style={{ width: "150px", marginRight: "10px" }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

{!userAccount && (
        <div className="liked-anime-scroll">
          <h2>Recently Liked Anime</h2>
          <div className="liked-anime-cards">
            {recentlyLikedAnime.map((anime, index) => (
              <div key={index} className="liked-anime-card">
                <Link to={`/details/${anime.id}`}>
                  <img
                    src={anime.imageUrl}
                    alt={`Recently Liked Anime ${index + 1}`}
                    style={{ width: "150px", marginRight: "10px" }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      {followingReviews.length > 0 && (
        <div className="liked-anime-scroll">
          <h2>
            {userAccount
              ? "Reviews from Users You Follow"
              : "Recently Added Reviews"}
          </h2>
          <div className="liked-anime-cards">
            {followingReviews.map((review, index) => (
              <div key={index} className="liked-anime-card">
                <div className="review-info">
                  {userAccount && (
                    <Link to={`/profile/${review.userId}`}>
                      <p className="reviewer-username">
                        {review.reviewerUsername}
                      </p>
                    </Link>
                  )}
                  <Link to={`/details/${review.animeId}`}>
                    <img
                      src={review.animeImage}
                      alt={`Anime ${index + 1}`}
                      style={{ width: "125px", marginRight: "10px" }}
                    />
                  </Link>
                  <div style={{ maxWidth: "125px" }}>{review.reviewText}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
