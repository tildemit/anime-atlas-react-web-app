import React, { useState, useEffect } from 'react';
import * as client from "./client";
import { useParams } from 'react-router-dom';

const CharacterDetails = () => {
  const { characterId } = useParams();
  const [characterDetails, setCharacterDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

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
      } catch (error) {
        console.error('Error fetching character details:', error);
      }
    };

    fetchCharacterDetails();
  }, [characterId]);

  const handleLikeCharacter = async () => {
    try {
      if (!user || user.role === 'BASIC') {
        // If the user is not logged in or has a BASIC role, display a prompt
        alert('Please sign in or upgrade your account to like characters.');
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
      console.error('Error handling like/unlike character:', error);
    }
  };

  if (!user || user.role === 'BASIC' || !characterDetails) {
    // Display a prompt to sign in or upgrade
    return (
      <div>
        <p>Please sign in or upgrade your account to view character details.</p>
        {/* You can add sign-in and upgrade buttons or links here */}
      </div>
    );
  }

  return (
    <div className="character-details-container">
      <button onClick={handleLikeCharacter} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', cursor: 'pointer', color: isLiked ? 'red' : 'white' }}>
        {isLiked ? '❤️' : '🤍'}
      </button>

      <h1>{characterDetails.name}</h1>
      <img src={characterDetails.images.jpg.image_url} alt={characterDetails.name} style={{ width: '300px', marginRight: '10px' }} />
      
      <h2>Details</h2>
      <p><strong>Name Kanji:</strong> {characterDetails.name_kanji}</p>
      
      <h2>Nicknames</h2>
      <ul>
        {characterDetails.nicknames.map((nickname, index) => (
          <li key={index}>{nickname}</li>
        ))}
      </ul>

      <h2>About</h2>
      <p>{characterDetails.about}</p>

      {/* Add more details as needed */}
    </div>
  );
};

export default CharacterDetails;
