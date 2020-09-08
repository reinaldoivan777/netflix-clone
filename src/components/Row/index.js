import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
import { toast, ToastContainer } from "react-toastify";

import axios from "../../shared/axios";
import "./index.css";
import { image_base_url } from "../../shared/imageUrl";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    };
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const failed = (responseMessage) =>
    toast.error(responseMessage, { autoClose: 4000 });

  const handleClick = (movie) => {
    if (trailerUrl) setTrailerUrl("");
    else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => failed(error));
    }
  };

  return (
    <div className="row">
      <ToastContainer position="top-right" autoClose={4000} pauseOnHover />
      <h2>{title}</h2>

      <div className="row__posters">
        {movies?.map((movie) => (
          <img
            key={movie.id}
            src={`${image_base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            className={classnames("row__poster", {
              row__posterLarge: isLargeRow,
            })}
            onClick={() => handleClick(movie)}
          />
        ))}
      </div>

      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

Row.defaultProps = {
  isLargeRow: false,
  title: "",
  fetchUrl: "",
};

export default Row;
