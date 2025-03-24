import { Detail } from "../../types/Detail";


export async function getMovieDetail(imdbID: string): Promise<Detail|undefined> {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=cd2aa4ca&i=${imdbID}&plot=full`);
        const data = await response.json();
        console.log(response);
        console.log(data);

        if (data.Response === "True") {
            const movies = data as Detail;
            console.log(movies);
            return movies;
        }
        else {
            return undefined;
        }
    }
    catch {
        return undefined;
    }
}

