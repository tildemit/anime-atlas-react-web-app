import React, { useState, useEffect } from 'react';
import * as client from "./client";
import { useParams, Link } from 'react-router-dom';

const Details = () => {
  const { animeId } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const animeReviews = await client.getReviews(animeId);
        setReviews(animeReviews);

        const userAccount = await client.account();
        setUser(userAccount);

        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        setAnimeDetails(data.data || null);

        const charactersResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        const charactersData = await charactersResponse.json();
        const mainCharacters = charactersData.data.filter((character) => character.role === 'Main');
        setCharacters(mainCharacters);

        const videosResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/videos`);
        const videosData = await videosResponse.json();
        setVideos(videosData.data.promo || []);

        if (userAccount?.likedAnime?.includes(animeId)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error fetching anime details:', error);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  const handleLikeAnime = async () => {
    try {
      if (!user) {
        // If the user is not logged in, prompt them to sign in
        // You can customize this part based on your authentication flow
        alert('Please sign in to like the anime.');
        return;
      }

      const newLikeStatus = !isLiked;

      if (newLikeStatus) {
        await client.likeAnime(animeId, user._id);
        await client.addAnime({
          animeId: animeDetails.mal_id.toString(),
          imageUrl: animeDetails.images.jpg.image_url,
        });
      } else {
        await client.unlikeAnime(animeId, user._id);
      }

      setIsLiked(newLikeStatus);
    } catch (error) {
      console.error('Error handling like/unlike anime:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post the review
      await client.postReview({
        animeId: animeId,
        userId: user?._id, // Use optional chaining to handle null user
        reviewText: reviewText,
      });

      // Fetch updated reviews
      const updatedReviews = await client.getReviews(animeId);
      setReviews(updatedReviews);

      // Call client.addAnime to add the anime to the user's list
      await client.addAnime({
        animeId: animeDetails.mal_id.toString(),
        imageUrl: animeDetails.images.jpg.image_url,
      });

      // Clear the review text input
      setReviewText('');
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  if (!animeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <button onClick={handleLikeAnime} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', cursor: 'pointer', color: isLiked ? 'red' : 'white' }}>
        {isLiked ? '❤️' : '🤍'}
      </button>

      <h1>{animeDetails.title}</h1>
      <img src={animeDetails.images.jpg.image_url} alt={animeDetails.title} style={{ width: '300px', marginRight: '10px' }} />
      <p>{animeDetails.synopsis}</p>

      {reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Reviews</h2>
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review._id}>
                <Link to={`/profile/${review.userId}`}>{/* Link to user profile */}
                  <p>{review.reviewText}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Form */}
      {user && ( // Only render the form if the user is not null (logged in)
        <div className="review-form">
          <h2>Write a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>
      )}

      {characters.length > 0 && (
        <div className="characters-section">
          <h2>Main Characters</h2>
          <ul className="characters-list">
            {characters.map((character) => (
              <li key={character.character.mal_id}>
                <Link to={`/characterdetails/${character.character.mal_id}`}>
                  <img src={character.character.images.jpg.image_url} alt={character.character.name} style={{ width: '150px', marginRight: '10px' }} />
                </Link>
                <p>{character.character.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {videos.length > 0 && (
        <div className="videos-section">
          <h2>Videos</h2>
          <ul className="videos-list">
            {videos
              .filter((video) => video.title.toLowerCase().includes('trailer') || video.title.toLowerCase().includes('pv'))
              .reverse()
              .slice(0, 2)
              .map((video) => (
                <li key={video.title}>
                  <p>{video.title}</p>
                  <iframe
                    title={video.title}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.trailer.youtube_id}`}
                    allowFullScreen
                  ></iframe>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Add more details as needed */}
    </div>
  );
};

export default Details;
