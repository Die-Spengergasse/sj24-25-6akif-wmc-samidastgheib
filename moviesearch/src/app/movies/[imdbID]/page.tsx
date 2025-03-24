/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getMovieDetail } from './MovieDetailApiClient';

interface MovieDetailProps {
  params: {
    imdbID: string;
  };
}

export default async function MovieDetail({ params }: MovieDetailProps) {
  const { imdbID } = await params;
  console.log("hellloooooooooooooooo")
  console.log(imdbID);
  const res = await getMovieDetail(imdbID);
  if (!res) {
    return notFound();
  }
 

  return (
    <div>
      <h1>{res.Title} ({res.Year})</h1>
      <img src={res.Poster} alt={res.Title} width="200" />
      <p><strong>Genre:</strong> {res.Genre}</p>
      <p><strong>Plot:</strong> {res.Plot}</p>
      <p><strong>Director:</strong> {res.Director}</p>
      <p><strong>Actors:</strong> {res.Actors}</p>
      <p><strong>Awards:</strong> {res.Awards}</p>
      <p><strong>IMDB Rating:</strong> {res.imdbRating}</p>
      <p><strong>IMDB Votes:</strong> {res.imdbVotes}</p>
      <p><strong>Metascore:</strong> {res.Metascore}</p>
      <p><strong>Runtime:</strong> {res.Runtime}</p>
      <p><strong>Language:</strong> {res.Language}</p>
      <p><strong>Country:</strong> {res.Country}</p>
      <p><strong>Released:</strong> {res.Released}</p>
      <p><strong>Production:</strong> {res.Production}</p>
      <p><strong>DVD:</strong> {res.DVD}</p>
      <p><strong>Box Office:</strong> {res.BoxOffice}</p>
      <p><strong>Ratings:</strong>
        <ul>
          {res.Ratings.map(rating => (
            <li key={rating.Source}>{rating.Source}: {rating.Value}</li>
          ))}
        </ul>
      </p>


    </div>
  );
}
