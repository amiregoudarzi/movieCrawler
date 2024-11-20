const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const makedir = (name) => {
    return new Promise((resolve, reject) => {
        const dirName = name.toString();
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                reject(Error(err.message));
            } else {
                console.log(`Directory created: ${dirName}`);
                resolve(dirName);
            }
        });
    });
};

const createFile = (dirName, title, data) => {
    return new Promise((resolve, reject) => {
        const filePath = `${dirName}/${title}.txt`;
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error('Error writing to file', err);
                reject(err);
            } else {
                console.log(`File '${filePath}' written successfully`);
                resolve();
            }
        });
    });
};

const movieList = [];

const baseUrl = 'https://www.film2movie.asia/category/top-imdb-250/';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
};

let globalCounter = 1; 

async function scrapeMoviename(pageNumber = 1, maxPages = 24) {
    try {
        const url = pageNumber === 1 ? baseUrl : `${baseUrl}page/${pageNumber}/`;
        const response = await axios.get(url, { headers });
        const html = response.data;
        const $ = cheerio.load(html);

        const movie_names = [];
        const dirName = `Movie_names_page_${pageNumber}`;

  
        $('div.title h2 a').each((index, element) => {
            let movie_name = $(element).text().trim();
            movie_name = movie_name.replace(/^دانلود فیلم\s*/, '');
            movie_names.push(movie_name);
        });

        if (movie_names.length === 0) {
            console.log(`No movie names found on page ${pageNumber}`);
            return;
        }
        await makedir(dirName);
        for (let name of movie_names) {
            const jsonMoviename = JSON.stringify({ movie_name: name }, null, 2);
            await createFile(dirName, name, jsonMoviename); 
        }
        

        console.log(`Movie Names - Page ${pageNumber}:`);
        movie_names.forEach((name) => {
            console.log(`${globalCounter}. ${name}`);
            globalCounter++;
        });

        if (pageNumber < maxPages) {
            console.log(`Scraping page ${pageNumber + 1}...`);
            await scrapeMoviename(pageNumber + 1, maxPages);
        } else {
            console.log('Finished scraping all pages.');
        }

    } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error.message);
    }
}

scrapeMoviename(1, 24);
