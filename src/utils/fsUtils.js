const fs = require('fs').promises;
const path = require('path');

const pathTalker = path.resolve(__dirname, '../talker.json');

async function readTalkersData() {
  try {
    const data = await fs.readFile(pathTalker);
    const talks = JSON.parse(data);

    return talks;
  } catch (error) {
    console.error(`Error na leiura do arquivo: ${error}`);
  } 
}

async function scriptTalkersData(id) {
  try {
    const data = await fs.readFile(pathTalker);
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

const verifyToken = (req, response, next) => {
  const tokenRandom = req.headers.authorization;
  if (!tokenRandom) {
    return response.status(401).json({ message: 'Token não encontrado' });
  }
  if (tokenRandom.length !== 16) {
    return response.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const verifyName = (req, response, next) => {
  const { name, age } = req.body;
  if (!name) {
    return response.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  if (!age) {
    return response.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return response.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const verifyDate = (req, response, next) => {
  const { talk } = req.body;
  const validate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  if (!talk) {
    return response.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  const { watchedAt } = req.body.talk;
  if (!watchedAt) {
    return response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!validate.test(watchedAt)) {
    return response.status(400).json({ 
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const verifyRate = (req, response, next) => {
  const { rate } = req.body.talk;
  if (!rate && rate !== 0) {
    return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate > 5 || rate < 1) {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

const getTalkers = async () => {
  const data = path.resolve(pathTalker);
  const talkers = JSON.parse(await fs.readFile(data, 'utf-8'));
  return talkers;
};
const talkerEdit = async (id, data) => {
  const talker = JSON.parse(await fs.readFile(pathTalker));
  const index = talker.findIndex((talkers) => talkers.id === Number(id));
  talker[index] = { id: Number(id), ...data };
  await fs.writeFile(pathTalker, JSON.stringify(talker));
  return talker[index];
};

const talkerDelete = async (id) => {
  const talker = JSON.parse(await fs.readFile(pathTalker));
  const newForm = talker.filter((talkers) => talkers.id !== Number(id));
  await fs.writeFile(pathTalker, JSON.stringify(newForm));
  return true;
};

module.exports = {
  readTalkersData,
  scriptTalkersData,
  validations,
  verifyToken,
  verifyName,
  verifyDate,
  verifyRate,
  getTalkers,
  talkerEdit,
  talkerDelete,
};