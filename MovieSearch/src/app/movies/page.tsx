"use client";
import { useState } from "react";
import MovieList from "./MovieList";
import SearchForm from "./SearchForm";
import { Movie } from "../types/Movie";

interface MovieDetail {
    Title: string;
    Year: string;
    Plot: string;
    Ratings: { Source: string; Value: string }[];
  }

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    return (
        <div>
            <h1>Search for movies</h1>
            <SearchForm setMovies={setMovies}></SearchForm>
            {movies.length > 0 && <MovieList movies={movies}></MovieList>}
        </div>
    )
}

async function getMovieDetails(imdbID: string): Promise<MovieDetail | null> {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=cd2aa4ca&i=${imdbID}&plot=full`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      return response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  export async function MovieDetailsPage({ params }: { params: { imdbID: string } }) {
    const movie = await getMovieDetails(params.imdbID);
    if (!movie) {
      return <div>Error loading movie details.</div>;
    }
  
    return (
      <div className="container mx-auto p-4">
        <MovieDetailView
          title={movie.Title}
          year={movie.Year}
          plot={movie.Plot}
          ratings={movie.Ratings}
        />
      </div>
    );
  }
  
  interface MovieDetailViewProps {
    title: string;
    year: string;
    plot: string;
    ratings: { Source: string; Value: string }[];
  }
  
  function MovieDetailView({ title, year, plot, ratings }: MovieDetailViewProps) {
    return (
      <div>
        <h2>{title} ({year})</h2>
        <p>{plot}</p>
        <ul>
          {ratings.map(rating => (
            <li key={rating.Source}>
              {rating.Source}: {rating.Value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
