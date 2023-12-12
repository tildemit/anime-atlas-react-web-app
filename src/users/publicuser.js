// Import statements
import * as client from "./client";
import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

// Functional component
function PublicUser() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [likedAnimeList, setLikedAnimeList] = useState([]);

  // Define fetchPublicUser using useCallback
  const fetchPublicUser = useCallback(async () => {
    try {
      // Fetch the public user data
      const publicUser = await client.findUserById(userId);
      setUser(publicUser);

      // Fetch user reviews
      const reviews = await client.findUserReviews(publicUser);
      setUserReviews(reviews);

      // Fetch anime details for reviews
      const animeImages = await Promise.all(reviews.map((review) => client.getAnime(review.animeId)));
      setAnimeImages(animeImages.map((animeData) => animeData.imageUrl)); // Assuming the field is called animeUrl

      // Fetch anime details for likedAnime
      const likedAnime = await Promise.all(publicUser.likedAnime.map((animeId) => client.getAnime(animeId)));
      setLikedAnimeList(likedAnime.map((animeData) => animeData.imageUrl)); // Assuming the field is called animeUrl
    } catch (error) {
      console.error('Error fetching public user details:', error);
    }
  }, [userId]);

  // Effect hook to fetch account details on component mount and when the page reloads
  useEffect(() => {
    fetchPublicUser();
  }, [fetchPublicUser]); // Add fetchPublicUser as a dependency

  return (
    <div className="public-user-container">
      {/* Public user profile section */}
      <div className="public-user-profile-section">
        <h1>Public Profile</h1>
        {user && (
          <div>
            <p>Username: {user.username}</p>
            <p>First Name: {user.firstName}</p>
            <p>User Type: {user.role}</p>
          </div>
        )}
      </div>

      {/* Liked anime section */}
      <div className="liked-anime-section">
        <h2>Liked Anime</h2>
        <ul>
          {likedAnimeList.map((imageUrl, index) => (
            <li key={index}>
              {/* Link to details page with animeId */}
              <Link to={`/details/${user.likedAnime[index]}`}>
                <img
                  src={imageUrl}
                  alt={`Liked Anime ${index + 1}`}
                  style={{ width: '125px', marginRight: '10px' }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Public user reviews section */}
      <div className="public-user-reviews-section">
        <h2>User Reviews</h2>
        <ul>
          {userReviews.map((review, index) => (
            <li key={review._id}>
              {/* Link to details page with animeId */}
              <Link to={`/details/${review.animeId}`}>
                <img
                  src={animeImages[index]}
                  alt={`Anime ${review.animeId}`}
                />
              </Link>
              {review.reviewText}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Export the component
export default PublicUser;
