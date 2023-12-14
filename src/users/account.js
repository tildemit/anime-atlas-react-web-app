import * as client from "./client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./account.css";

function Account() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [usernames, setUsernames] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [likedAnimeList, setLikedAnimeList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [likedCharacters, setLikedCharacters] = useState([]);
  const navigate = useNavigate();

  const fetchAccount = async () => {
    try {
      const updatedAccount = await client.account();
      setAccount(updatedAccount);

      const reviews = await client.findUserReviews(updatedAccount);
      setUserReviews(reviews);

      const animeImages = await Promise.all(
        reviews.map((review) => client.getAnime(review.animeId))
      );
      setAnimeImages(animeImages.map((animeData) => animeData.imageUrl));

      const likedAnime = await Promise.all(
        updatedAccount.likedAnime.map((animeId) => client.getAnime(animeId))
      );
      setLikedAnimeList(likedAnime.map((animeData) => animeData.imageUrl));

      setFollowingList(updatedAccount.following || []);
      setFollowersList(updatedAccount.followers || []);

      if (updatedAccount.role === "PREMIUM") {
        const likedChars = await Promise.all(
          updatedAccount.likedCharacters.map((characterId) =>
            client.getCharacter(characterId)
          )
        );
        setLikedCharacters(likedChars.map((charData) => charData.imageUrl));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching account details:", error);
      setLoading(false);
    }
  };

  const fetchUsername = async (userId) => {
    const user = await client.findUserById(userId);
    return user.username;
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesMap = {};

      await Promise.all(
        followingList.map(async (followedUserId) => {
          const username = await fetchUsername(followedUserId);
          usernamesMap[followedUserId] = username;
        })
      );

      await Promise.all(
        followersList.map(async (followerUserId) => {
          const username = await fetchUsername(followerUserId);
          usernamesMap[followerUserId] = username;
        })
      );

      setUsernames(usernamesMap);
    };

    fetchUsernames();
  }, [followingList, followersList]);

  const save = async () => {
    await client.updateUser(account);
  };

  const handleFollow = async (userId) => {
    try {
      await client.follow(userId);

      setFollowingList([...followingList, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleSignout = async () => {
    try {
      await client.signout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await client.unfollow(userId);

      setFollowingList(
        followingList.filter((followedUserId) => followedUserId !== userId)
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-container">
      {}
      {!account ? (
        <div>
          <p>Please sign in to view your account.</p>
          <Link to="/login">Sign In</Link>
        </div>
      ) : (
        <div className="account-details">
          {}
          <div className="profile-section">
            <div className="top-bar">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/search" className="nav-link">
                Search
              </Link>
              <Link onClick={handleSignout} className="nav-link">
                Signout
              </Link>
            </div>
            <h1>Profile</h1>
            <div className="profile-input">
              <label htmlFor="password">Password:</label>
              <input
                type="text"
                id="password"
                value={account.password}
                onChange={(e) =>
                  setAccount({ ...account, password: e.target.value })
                }
              />
            </div>
            <div className="profile-input">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={account.firstName}
                onChange={(e) =>
                  setAccount({ ...account, firstName: e.target.value })
                }
              />
            </div>
            <div className="profile-input">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={account.lastName}
                onChange={(e) =>
                  setAccount({ ...account, lastName: e.target.value })
                }
              />
            </div>
            <div className="profile-input">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={account.email}
                onChange={(e) =>
                  setAccount({ ...account, email: e.target.value })
                }
              />
            </div>
            <div className="profile-input">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                onChange={(e) =>
                  setAccount({ ...account, role: e.target.value })
                }
                value={account.role}
              >
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>

            {}
            <div className="action-buttons">
              <button className="save-button" onClick={save}>
                Save
              </button>
            </div>

            {}
            <Link to="/users" className="users-link">
              Users
            </Link>
          </div>

          {}
          <h2>Liked Anime</h2>
          <div className="liked-anime-section">
            <ul className="liked-anime-cards">
              {likedAnimeList.map((imageUrl, index) => (
                <li
                  key={index}
                  className="liked-anime-card"
                  style={{ minWidth: "125px", marginRight: "10px" }}
                >
                  {}
                  <Link to={`/details/${account.likedAnime[index]}`}>
                    <img
                      src={imageUrl}
                      alt={`Liked Anime ${index + 1}`}
                      style={{ width: "125px", marginRight: "10px" }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="user-reviews-section">
            <h2>User Reviews</h2>
            <div className="liked-anime-cards">
              {userReviews.map((review, index) => (
                <div key={review._id} className="liked-anime-card">
                  {}
                  <Link to={`/details/${review.animeId}`}>
                    <img
                      src={animeImages[index]}
                      alt={`Anime ${review.animeId}`}
                      style={{ width: "125px", marginRight: "10px" }}
                    />
                  </Link>

                  <div style={{ maxWidth: "125px" }}>{review.reviewText}</div>
                  {}
                </div>
              ))}
            </div>
          </div>

          <div className="followers-section">
            <h2>Following</h2>
            <div className="liked-anime-cards">
              {followingList.map((followedUserId) => (
                <div
                  key={followedUserId}
                  className="liked-anime-card"
                  style={{ minWidth: "125px", marginRight: "10px" }}
                >
                  {}
                  <Link to={`/profile/${followedUserId}`}>
                    {usernames[followedUserId]} {}
                  </Link>
                  <div>
                    <button onClick={() => handleUnfollow(followedUserId)}>
                      Unfollow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="followers-section">
            <h2>Followers</h2>
            <div className="liked-anime-cards">
              {followersList.map((followerUserId) => (
                <div
                  key={followerUserId}
                  className="liked-anime-card"
                  style={{ minWidth: "125px", marginRight: "10px" }}
                >
                  {}
                  <Link to={`/profile/${followerUserId}`}>
                    {usernames[followerUserId]} {}
                  </Link>
                  {}
                  <div>
                    {!followingList.includes(followerUserId) ? (
                      <button onClick={() => handleFollow(followerUserId)}>
                        Follow
                      </button>
                    ) : (
                      <button onClick={() => handleUnfollow(followerUserId)}>
                        Unfollow
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {account.role === "PREMIUM" && <h2>Liked Characters</h2>}
          {}
          {account.role === "PREMIUM" && (
            <div className="liked-anime-cards">
              {likedCharacters.map((charImageUrl, index) => (
                <div key={index} className="liked-anime-card">
                  {}
                  <Link
                    to={`/characterdetails/${account.likedCharacters[index]}`}
                  >
                    <img
                      src={charImageUrl}
                      alt={`Liked Character ${index + 1}`}
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
