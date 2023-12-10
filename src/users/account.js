// Import statements
import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./account.css"; // Import the CSS file

// Functional component
function Account() {
  const [account, setAccount] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [likedAnimeList, setLikedAnimeList] = useState([]);
  const navigate = useNavigate();

  // Function to fetch user account details and reviews
  const fetchAccount = async () => {
    try {
      const account = await client.account();
      setAccount(account);

      // Fetch user reviews
      const reviews = await client.findUserReviews(account);
      setUserReviews(reviews);

      // Fetch anime details and update state
      const animeImagePromises = reviews.map((review) => client.getAnimeDetails(review.animeId));
      const animeImages = await Promise.all(animeImagePromises);
      setAnimeImages(animeImages.map((animeData) => animeData.data.images.jpg.image_url));

      const likedAnimePromises = account.likedAnime.map((animeId) => client.getAnimeDetails(animeId))
      const likedAnime = await Promise.all(likedAnimePromises)
      setLikedAnimeList(likedAnime.map((animeData) => animeData.data.images.jpg.image_url))
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  // Effect hook to fetch account details on component mount
  useEffect(() => {
    fetchAccount();
  }, []);

  // Function to save user changes
  const save = async () => {
    await client.updateUser(account);
  };

  return (
    <div className="w-50">
      {/* Profile section */}
      <h1>Profile</h1>
      {account && (
        <div>
          <input
            value={account.password}
            onChange={(e) => setAccount({ ...account, password: e.target.value })}
          />
          <input
            value={account.firstName}
            onChange={(e) => setAccount({ ...account, firstName: e.target.value })}
          />
          <input
            value={account.lastName}
            onChange={(e) => setAccount({ ...account, lastName: e.target.value })}
          />
          <input
            value={account.email}
            onChange={(e) => setAccount({ ...account, email: e.target.value })}
          />
          <select onChange={(e) => setAccount({ ...account, role: e.target.value })}>
            <option value="BASIC">Basic</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
      )}

      {/* Save button */}
      <button onClick={save}>Save</button>

      {/* Users link */}
      <Link to="/users" className="btn btn-warning w-100">
        Users
      </Link>

      {/* Liked anime section */}
      <div>
        <h2>Liked Anime</h2>
        <ul>
          {likedAnimeList.map((imageUrl, index) => (
            <li key={index}>
              <img
                src={imageUrl}
                alt={`Liked Anime ${index + 1}`}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* User reviews section */}
      <div>
        <h2>User Reviews</h2>
        <ul>
          {userReviews.map((review, index) => (
            <li key={review._id}>
              {/* Display anime picture inline */}
              {review.animeId && (
                <>
                  <img
                    src={animeImages[index]}
                    alt={`Anime ${review.animeId}`}
                  />
                  {review.reviewText}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Export the component
export default Account;
