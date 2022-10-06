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

const validations = (email, password) => {
  const regex = /\S+@\S+\.\S+/;
  if (!email) {
    return { message: 'O campo "email" é obrigatório' };
  }
  if (!regex.test(email)) {
    return { message: 'O "email" deve ter o formato "email@email.com"' };
  }
  if (!password) {
    return { message: 'O campo "password" é obrigatório' };
  }
  if (password.length < 6) {
    return { message: 'O "password" deve ter pelo menos 6 caracteres' };
  }

  return true;
};

module.exports = {
  readTalkersData,
  scriptTalkersData,
  validations,
};