import React, { useState, useEffect } from "react";
import * as client from "./client";
import "./table.css"; // Import the CSS file

function UserTable() {
  const [users, setUsers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    const fetchedUsers = await client.findAllUsers();
    setUsers(fetchedUsers);

    // Fetch the current user's following list
    const userAccount = await client.account();
    setFollowingList(userAccount.following || []);
    setCurrentUser(userAccount);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFollow = async (userId) => {
    try {
      // Call the follow function in your client, passing the userId
      await client.follow(userId);

      // Update the local state to reflect the change
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isFollowing: true } : user
      );

      setUsers(updatedUsers);

      // Update the following list for the current user
      setFollowingList([...followingList, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      // Call the unfollow function in your client, passing the userId
      await client.unfollow(userId);

      // Update the local state to reflect the change
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isFollowing: false } : user
      );

      setUsers(updatedUsers);

      // Update the following list for the current user
      setFollowingList(followingList.filter((id) => id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="table-container">
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
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td className="actions-cell">
                {!followingList.includes(user._id) && user._id !== currentUser?._id && (
                  <button
                    className="follow-button"
                    onClick={() => handleFollow(user._id)}
                  >
                    Follow
                  </button>
                )}
                {followingList.includes(user._id) && user._id !== currentUser?._id && (
                  <button
                    className="unfollow-button"
                    onClick={() => handleUnfollow(user._id)}
                  >
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
