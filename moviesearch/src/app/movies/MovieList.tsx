import Link from "next/link";
import { Movie } from "../types/Movie";
import styles from "./MovieList.module.css";
type MovieListProps = {
    movies: Movie[];
}
export default function MovieList({ movies }: MovieListProps) {
    return (
        <div className={styles.movielist}>
            <h2>{movies.length} movies found</h2>
            <div className={styles.movies}>
                {movies.map(movie => (
                    <div key={movie.imdbID} className={styles.movie}>
                        <div className={styles.moviePoster}>
                            <Link href={`/movies/${movie.imdbID}`} legacyBehavior>
                                <a>
                                    <img src={movie.Poster} alt={movie.Title} />
                                </a>
                            </Link>
                        </div>
                        <div className={styles.movieTitle}>{movie.Title}</div>
                        <div className={styles.movieImdbId}>IMDB ID: {movie.imdbID}</div>

                    </div>
                ))}
            </div>
        </div>
    )
}
