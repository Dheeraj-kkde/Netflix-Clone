import React, { useState, useEffect } from "react";
import instance from "../../axios";
import "./Row.css";

const base_image_url = "https://image.tmdb.org/t/p/original/";

function Row(props) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await instance.get(props.fetchUrl);
      const response = await request.data.results;
      setMovies(response);
    }
    fetchData();
  }, [props.fetchUrl]);

  return (
    <div className="row">
      <h2>{props.title}</h2>
      <div className="row_posters">
        {movies.map((movie) => {
          return (
            <img
              key={movie.id}
              className="row_poster"
              src={`${base_image_url}${movie.poster_path}`}
              alt={movie.name}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Row;
