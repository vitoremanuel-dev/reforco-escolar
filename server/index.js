require('dotenv').config();

const path = require('path');
const express = require('express');
const { init } = require('./store');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ------------------------------------------------------------------ */
/* Alunos                                                              */
/* ------------------------------------------------------------------ */
app.get('/api/alunos', asyncHandler(async (_req, res) => {
  res.json(await store.getAlunos());
}));

app.post('/api/alunos', asyncHandler(async (req, res) => {
  if (!req.body.nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  const id = await store.createAluno(req.body);
  res.status(201).json({ id });
}));

app.put('/api/alunos/:id', asyncHandler(async (req, res) => {
  await store.updateAluno(req.params.id, req.body);
  res.json({ ok: true });
}));

app.delete('/api/alunos/:id', asyncHandler(async (req, res) => {
  await store.deleteAluno(req.params.id);
  res.json({ ok: true });
}));

/* ------------------------------------------------------------------ */
/* Voluntários                                                         */
/* ------------------------------------------------------------------ */
app.get('/api/voluntarios', asyncHandler(async (_req, res) => {
  res.json(await store.getVoluntarios());
}));

app.post('/api/voluntarios', asyncHandler(async (req, res) => {
  if (!req.body.nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  const id = await store.createVoluntario(req.body);
  res.status(201).json({ id });
}));

app.put('/api/voluntarios/:id', asyncHandler(async (req, res) => {
  await store.updateVoluntario(req.params.id, req.body);
  res.json({ ok: true });
}));

app.delete('/api/voluntarios/:id', asyncHandler(async (req, res) => {
  await store.deleteVoluntario(req.params.id);
  res.json({ ok: true });
}));

/* ------------------------------------------------------------------ */
/* Disciplinas                                                         */
/* ------------------------------------------------------------------ */
app.get('/api/disciplinas', asyncHandler(async (_req, res) => {
  res.json(await store.getDisciplinas());
}));

app.post('/api/disciplinas', asyncHandler(async (req, res) => {
  if (!req.body.nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  const id = await store.createDisciplina(req.body);
  res.status(201).json({ id });
}));

/* ------------------------------------------------------------------ */
/* Atividades                                                          */
/* ------------------------------------------------------------------ */
app.get('/api/atividades', asyncHandler(async (_req, res) => {
  res.json(await store.getAtividades());
}));

app.post('/api/atividades', asyncHandler(async (req, res) => {
  const { alunos, ...fields } = req.body;
  if (!fields.titulo) return res.status(400).json({ error: 'O campo "título" é obrigatório.' });
  const id = await store.createAtividade(fields, Array.isArray(alunos) ? alunos : []);
  res.status(201).json({ id });
}));

app.put('/api/atividades/:id', asyncHandler(async (req, res) => {
  const { alunos, ...fields } = req.body;
  await store.updateAtividade(req.params.id, fields, Array.isArray(alunos) ? alunos : []);
  res.json({ ok: true });
}));

app.delete('/api/atividades/:id', asyncHandler(async (req, res) => {
  await store.deleteAtividade(req.params.id);
  res.json({ ok: true });
}));

/* ------------------------------------------------------------------ */
/* Progressos                                                          */
/* ------------------------------------------------------------------ */
app.get('/api/progressos', asyncHandler(async (req, res) => {
  res.json(await store.getProgressos(req.query.aluno_id));
}));

app.post('/api/progressos', asyncHandler(async (req, res) => {
  if (!req.body.aluno_id) return res.status(400).json({ error: 'O campo "aluno" é obrigatório.' });
  const id = await store.createProgresso(req.body);
  res.status(201).json({ id });
}));

app.delete('/api/progressos/:id', asyncHandler(async (req, res) => {
  await store.deleteProgresso(req.params.id);
  res.json({ ok: true });
}));

/* ------------------------------------------------------------------ */
/* Kanban                                                              */
/* ------------------------------------------------------------------ */
app.get('/api/kanban', asyncHandler(async (_req, res) => {
  res.json(await store.getKanban());
}));

app.post('/api/kanban', asyncHandler(async (req, res) => {
  if (!req.body.titulo) return res.status(400).json({ error: 'O campo "título" é obrigatório.' });
  const id = await store.createKanban(req.body);
  res.status(201).json({ id });
}));

app.put('/api/kanban/:id', asyncHandler(async (req, res) => {
  await store.updateKanban(req.params.id, req.body);
  res.json({ ok: true });
}));

app.delete('/api/kanban/:id', asyncHandler(async (req, res) => {
  await store.deleteKanban(req.params.id);
  res.json({ ok: true });
}));

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */
app.get('/api/dashboard', asyncHandler(async (_req, res) => {
  res.json(await store.getDashboard());
}));

/* ------------------------------------------------------------------ */
/* Fallback SPA + erros                                                */
/* ------------------------------------------------------------------ */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

let store;
init().then((s) => {
  store = s;
  app.listen(PORT, () => {
    console.log(`Plataforma de Reforço Escolar rodando em http://localhost:${PORT} (backend: ${store.backend})`);
  });
});
