const express = require('express');
const bodyParser = require('body-parser');
const { readTalkersData, scriptTalkersData } = require('./utils/fsUtils.js');
const getToken = require('./utils/token.js');

const app = express();
app.use(bodyParser.json());

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

app.post('/login', (_req, response) => {
  const token = getToken();
  response.status(HTTP_OK_STATUS).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
