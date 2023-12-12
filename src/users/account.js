// Import statements
import * as client from "./client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./account.css"; // Import the CSS file

// Functional component
function Account() {
  const [account, setAccount] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [likedAnimeList, setLikedAnimeList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [likedCharacters, setLikedCharacters] = useState([]);
  const navigate = useNavigate();

  // Function to fetch user account details and reviews
  const fetchAccount = async () => {
    try {
      // Fetch the latest account data
      const updatedAccount = await client.account();
      setAccount(updatedAccount);

      // Fetch user reviews
      const reviews = await client.findUserReviews(updatedAccount);
      setUserReviews(reviews);

      // Fetch anime details for reviews
      const animeImages = await Promise.all(reviews.map((review) => client.getAnime(review.animeId)));
      setAnimeImages(animeImages.map((animeData) => animeData.imageUrl)); // Assuming the field is called animeUrl

      // Fetch anime details for likedAnime
      const likedAnime = await Promise.all(updatedAccount.likedAnime.map((animeId) => client.getAnime(animeId)));
      setLikedAnimeList(likedAnime.map((animeData) => animeData.imageUrl)); // Assuming the field is called animeUrl

      // Retrieve followers and following lists
      setFollowingList(updatedAccount.following || []);
      setFollowersList(updatedAccount.followers || []);

      // Fetch liked characters for users with a PREMIUM role
      if (updatedAccount.role === 'PREMIUM') {
        const likedChars = await Promise.all(updatedAccount.likedCharacters.map((characterId) => client.getCharacter(characterId)));
        setLikedCharacters(likedChars.map((charData) => charData.imageUrl));
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  // Effect hook to fetch account details on component mount and when the page reloads
  useEffect(() => {
    fetchAccount();
  }, []);

  // Function to save user changes
  const save = async () => {
    await client.updateUser(account);
  };

  const signout = async () => {
    await client.signout();
    navigate("/signin");
  };

  // Function to handle follow
  const handleFollow = async (userId) => {
    try {
      // Call the follow function in your client, passing the userId
      await client.follow(userId);

      // Update the local state to reflect the change
      setFollowingList([...followingList, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Function to handle unfollow
  const handleUnfollow = async (userId) => {
    try {
      // Call the unfollow function in your client, passing the userId
      await client.unfollow(userId);

      // Update the local state to reflect the change
      setFollowingList(followingList.filter((followedUserId) => followedUserId !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="account-container">
      {/* Check if the user is anonymous */}
      {!account ? (
        <div>
          <p>Please sign in to view your account.</p>
          <Link to="/signin">Sign In</Link>
        </div>
      ) : (
        <div>
          {/* Profile section */}
          <div className="profile-section">
            <h1>Profile</h1>
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
            <select
              onChange={(e) => setAccount({ ...account, role: e.target.value })}
              value={account.role}
            >
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          {/* Save button */}
          <button onClick={save}>Save</button>
          <button onClick={signout}>Sign Out</button>

          {/* Users link */}
          <Link to="/users" className="btn btn-warning w-100">
            Users
          </Link>

          {/* Liked anime section */}
          <div className="liked-anime-section">
            <h2>Liked Anime</h2>
            <ul>
              {likedAnimeList.map((imageUrl, index) => (
                <li key={index}>
                  {/* Link to details page with animeId */}
                  <Link to={`/details/${account.likedAnime[index]}`}>
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

          {/* User reviews section */}
          <div className="user-reviews-section">
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

          {/* Following section */}
          <div className="following-section">
            <h2>Following</h2>
            <ul>
              {followingList.map((followedUserId) => (
                <li key={followedUserId}>
                  {/* Display user information and unfollow button */}
                  <Link to={`/profile/${followedUserId}`}>
                    {followedUserId} {/* Replace this with the actual user information */}
                  </Link>
                  <button onClick={() => handleUnfollow(followedUserId)}>Unfollow</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Followers section */}
          <div className="followers-section">
            <h2>Followers</h2>
            <ul>
              {followersList.map((followerUserId) => (
                <li key={followerUserId}>
                  {/* Display user information and follow/unfollow button */}
                  <Link to={`/profile/${followerUserId}`}>
                    {followerUserId} {/* Replace this with the actual user information */}
                  </Link>
                  {!followingList.includes(followerUserId) ? (
                    <button onClick={() => handleFollow(followerUserId)}>Follow</button>
                  ) : (
                    <button onClick={() => handleUnfollow(followerUserId)}>Unfollow</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Liked characters section for PREMIUM users */}
          {account.role === 'PREMIUM' && (
            <div className="liked-characters-section">
              <h2>Liked Characters</h2>
              <ul>
                {likedCharacters.map((charImageUrl, index) => (
                  <li key={index}>
                    {/* Link to character details page with characterId */}
                    <Link to={`/characterdetails/${account.likedCharacters[index]}`}>
                      <img
                        src={charImageUrl}
                        alt={`Liked Character ${index + 1}`}
                        style={{ width: '125px', marginRight: '10px' }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export the component
export default Account;
