const fs = require('fs').promises;

const findMovie = 'InceptIon'
const search = findMovie.toLowerCase();

async function searchMovie(search) {
    

    try {
        const index = JSON.parse(await fs.readFile('movieIndex.json', 'utf8'));
        const matchedMovies = Object.keys(index).filter(movie => movie.includes(search));

        if (matchedMovies) {
            for (let movie of matchedMovies) {
                const filePath = index[movie];
                const data = await fs.readFile(filePath, 'utf8');
                console.log(`Movie found: ${movie}`);
                console.log(data);
            }
        } else {
            console.log(`No movie found for "${search}"`);
        }
    } catch (error) {
        console.error("Error searching the movie:", error);
    }
}

searchMovie(search);
