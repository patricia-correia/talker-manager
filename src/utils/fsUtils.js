const fs = require('fs').promises;
const path = require('path');

async function readTalkersData() {
  try {
   const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
   const talks = JSON.parse(data);

   return talks;
 } catch (error) {
  console.error(`Error na leiura do arquivo: ${error}`);
 } 
}

module.exports = {
  readTalkersData,
};