const fs = require('fs');
const path = require('path');

const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('');

// for (let letter of alphabets) {
//     const filePath = path.join(__dirname, 'alphabets', `${letter}.json`);

//     fs.writeFile(filePath, JSON.stringify({}), (err) => {
//         if (err) {
//             console.error(`Error writing file ${letter}.json`, err);
//         } else {
//             console.log(`${letter}.json created successfully!`);
//         }
//     });
// }
// alphabets created successfully and done with the code.

const index = JSON.parse(fs.readFileSync('movieIndex.json', 'utf8'));

const alphabetDir = path.join(__dirname, 'alphabets');
if (!fs.existsSync(alphabetDir)) {
    fs.mkdirSync(alphabetDir);
}

Object.entries(index).forEach(([name, data]) => {
    const firstLetter = name[0].toLowerCase();
    
    if (alphabets.includes(firstLetter)) {
        const filePath = path.join(alphabetDir, `${firstLetter}.json`);

        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        fileContent[name] = data; 
        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');

    }
    });

console.log('Movies with key-value pairs sorted into alphabet files successfully!');
