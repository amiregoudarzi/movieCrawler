const fs = require('fs');
const path = require('path');

const movieName = 'hacksaw ridge 2016'.toLocaleLowerCase();
const firstLetter = movieName.slice(0, 1).toLowerCase();
const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('');

const files = fs.readdirSync('./alphabets');


if (alphabets.includes(firstLetter)) {
    const filePath = path.join(__dirname, 'alphabets', `${firstLetter}.json`);

    if (fs.existsSync(filePath)) {
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const moviePath = fileContent[movieName];
        if (moviePath) {
            console.log(`'${movieName}':`, moviePath);
        }
    }
}
