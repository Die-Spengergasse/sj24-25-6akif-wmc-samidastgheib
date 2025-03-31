import { Detail } from "./types/Detail";

export async function getMovieDetail(imdbID: string): Promise<Detail|undefined> {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=cd2aa4ca&i=${imdbID}&plot=full`);
        const data = await response.json();
        const movies = data.Search as Detail;
        return movies;
    }
    catch {
        return undefined;
    }
}