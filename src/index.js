const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const {
  readTalkersData,
  scriptTalkersData,
  validations,
  verifyToken,
  verifyName,
  verifyDate,
  verifyRate,
  getTalkers,
  talkerEdit,
} = require('./utils/fsUtils.js');
const getToken = require('./utils/token.js');

const app = express();
app.use(bodyParser.json());

const pathTalker = path.resolve(__dirname, 'talker.json');
const HTTP_RIGHT_STATUS = 400;
const HTTP_ERRO_STATUS = 404;
const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_request, response) => {
  const talkers = await readTalkersData();
  response.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, response) => {
  const { id } = req.params;
  const talkers = await scriptTalkersData(Number(id));
  if (!talkers) {
    response.status(HTTP_ERRO_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
  response.status(HTTP_OK_STATUS).json(talkers);
});

const validation = (req, response, next) => {
  const { email, password } = req.body;
  const validateData = validations(email, password);
  if (validateData === true) {
    return next();
  }
  response.status(HTTP_RIGHT_STATUS).json(validateData);
};

app.post('/login', validation, (req, response) => {
  const singin = ['email', 'password'];
  if (singin.every((elem) => elem in req.body)) {
    const token = getToken();
    response.status(HTTP_OK_STATUS).json({ token });
  }
  response.status(HTTP_ERRO_STATUS).json({ message: 'Senha ou email incorreto' });
});

app.post('/talker',
  verifyToken,
  verifyName,
  verifyDate,
  verifyRate,
  async (req, response) => {
    const talkers = await getTalkers();
    const talker = { ...req.body, id: talkers.length + 1 };
    talkers.push(talker);
    await fs.writeFile(pathTalker, JSON.stringify(talkers));
    response.status(201).json(talker);
  });

  app.put('/talker/:id',
  verifyToken,
  verifyName,
  verifyDate,
  verifyRate,
  async (req, response) => {
    const { id } = req.params;
    const formEdit = await talkerEdit(id, req.body);
    response.status(200).json(formEdit);
  });

app.listen(PORT, () => {
  console.log('Online');
});
