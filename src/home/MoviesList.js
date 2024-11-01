
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../shared/ErrorAlert";
import { listMovies } from "../utils/api";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const abortController = new AbortController();

    // Fetch movies and log the response
    listMovies(abortController.signal)
      .then((moviesData) => {
        console.log("Fetched Movies:", moviesData); // Log the fetched data to inspect
        setMovies(moviesData);
      })
      .catch(setError);

    return () => abortController.abort();
  }, []);

  // Render the list of movies with fallback for broken images
  const list = movies.map((movie) => (
    <article key={movie.movie_id} className="col-sm-12 col-md-6 col-lg-3 my-2">
      <img
        alt={`${movie.title} Poster`}
        className="rounded"
        src={movie.image_url}
        style={{ width: "100%" }}
        onError={(e) => {
          e.target.onerror = null; // Prevents infinite loop if placeholder image is broken
          e.target.src = "/path/to/placeholder.jpg"; // Path to a local or placeholder image
        }}
      />
      <Link to={`/movies/${movie.movie_id}`} className="stretched-link text-dark">
        <h3 className="font-poppins-heading text-center mt-2">{movie.title}</h3>
      </Link>
    </article>
  ));

  return (
    <main className="container">
      <ErrorAlert error={error} />
      <h2 className="font-poppins">Now Showing</h2>
      <hr />
      <section className="row">{list}</section>
    </main>
  );
}

export default MoviesList;