import React, { useState, useEffect } from "react";
import instance from "../../axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_image_url = "https://image.tmdb.org/t/p/original/";

function Row(props) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await instance.get(props.fetchUrl);
      const response = await request.data.results;
      setMovies(response);
    }
    fetchData();
  }, [props.fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  const handleMovieClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(
        movie?.name ||
          movie?.original_name ||
          movie?.source ||
          movie?.title ||
          movie?.original_title ||
          " "
      )
        .then((url) => {
          try {
            const urlObject = new URL(url);
            const urlParams = new URLSearchParams(urlObject.search);
            const videoId = urlParams.get("v");

            if (videoId) {
              setTrailerUrl(videoId);
            } else {
              console.error("Failed to get videoId from URL:", url);
            }
          } catch (error) {
            console.error("Error constructing or processing URL:", error);
          }
        })
        .catch((error) => {
          console.error("Error fetching or processing trailer:", error);
        });
    }
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>
      <div className="row_posters">
        {movies.map((movie) => {
          return (
            <img
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className={`row_poster ${props.isLargeRow && "row_posterLarge"}`}
              src={`${base_image_url}${
                props.isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          );
        })}
      </div>
      {trailerUrl && (
        <div className="video-container">
          <YouTube videoId={trailerUrl} opt={opts} />
        </div>
      )}
    </div>
  );
}

export default Row;
