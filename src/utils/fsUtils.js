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

async function scriptTalkersData(id) {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const talks = JSON.parse(data);

    return talks.find((elem) => elem.id === Number(id));
  } catch (error) {
    console.error(`Error na leitura do arquivo: ${error}`);
  }
}

module.exports = {
  readTalkersData,
  scriptTalkersData,
};