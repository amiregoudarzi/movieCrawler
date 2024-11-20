const fs = require('fs').promises;
const path = require('path');

async function buildIndex() {
    const pageNumber = Array.from({ length: 24 }, (_, i) => i + 1);
    const index = {};

    try {
        for (let pageNum of pageNumber) {
            const dirPath = path.join(__dirname, `Movie_names_page_${pageNum}`);
            const files = await fs.readdir(dirPath);

            for (let file of files) {
                const filePath = path.join(dirPath, file);
                const movieName = file.replace('.txt', '').toLowerCase(); 

                
                index[movieName] = filePath;
            }
        }

        
        await fs.writeFile('movieIndex.json', JSON.stringify(index, null, 2));
        console.log('Index created successfully!');
    } catch (error) {
        console.error("Error building the index:", error);
    }
}


buildIndex();
