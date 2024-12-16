import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const baseUrl = 'https://www.film2movie.asia/category/top-imdb-250/';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
};

let globalCounter = 1;

async function scrapeMoviename(pageNumber, maxPages) {
  try {

      const url = pageNumber === 1 ? baseUrl : `${baseUrl}page/${pageNumber}/`;

      const response = await axios.get(url, { headers });
      const html = response.data;
      const $ = cheerio.load(html);


      const movieNames = [];
      const years = [];

      $('div.title h2 a').each((index, element) => {
          let originalName = $(element).text().trim();
          originalName = originalName.replace(/^دانلود فیلم\s*/, '');
        //   movieNames.push(originalName);
        const match = originalName.match(/^(.*)\s(\d{4})$/);

        if (match) {
            const title = match[1];
            const year = match[2];
            movieNames.push(title);
            years.push(year);
        } else {
            console.log(`Could not parse: ${originalName}`);
        };
      });
    

      if (movieNames.length === 0) {
          console.log(`No movie names found on page ${pageNumber}. Stopping further scraping.`);
          return;
      }

      for (let index = 0; index < movieNames.length; index++) {
        const name = movieNames[index];
        const year = years[index];

        try {
            await prisma.movieName.create({
                data: {
                    name: name,
                    year: parseInt(year),  
                },
            });

            console.log(`${globalCounter}. ${name} (${year}) - Saved to DB`);
            globalCounter++;
        } catch (dbError) {
            console.error(`Error saving movie "${name}":`, dbError.message);
        }
    }

      if (pageNumber < maxPages) {
          await scrapeMoviename(pageNumber + 1, maxPages);
      } else {
          console.log('Finished scraping all pages.');
      }

  } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error.message);
  }
}

(async function() {
    try {
        await scrapeMoviename(1, 24);
        console.log('Scraping completed.');
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
    } finally {
        await prisma.$disconnect();
    }
})();