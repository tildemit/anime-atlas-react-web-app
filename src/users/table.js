import React, { useState, useEffect } from "react";
import * as client from "./client";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./table.css"; 

function UserTable() {
  const [users, setUsers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const fetchedUsers = await client.findAllUsers();
    setUsers(fetchedUsers);

    const userAccount = await client.account();
    setFollowingList(userAccount.following || []);
    setCurrentUser(userAccount);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFollow = async (userId) => {
    try {

      await client.follow(userId);

      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isFollowing: true } : user
      );

      setUsers(updatedUsers);

      setFollowingList([...followingList, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {

      await client.unfollow(userId);

      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isFollowing: false } : user
      );

      setUsers(updatedUsers);

      setFollowingList(followingList.filter((id) => id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleSignout = async () => {
    try {
      await client.signout();
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="table-container">
      <div className="top-bar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/search" className="nav-link">Search</Link>
        <Link onClick={handleSignout} className="nav-link">Signout</Link>

      </div>

      <h1>User List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/profile/${user._id}`}>{user.username}</Link>
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td className="actions-cell">
                {!followingList.includes(user._id) && user._id !== currentUser?._id && (
                  <button
                    className="follow-button"
                    onClick={() => handleFollow(user._id)}>
                    Follow
                  </button>
                )}
                {followingList.includes(user._id) && user._id !== currentUser?._id && (
                  <button
                    className="unfollow-button"
                    onClick={() => handleUnfollow(user._id)}>
                    Unfollow
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;