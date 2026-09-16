const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

/* ------------------------------------------------------------------ */
/* Dados iniciais (usados apenas no modo arquivo)                      */
/* ------------------------------------------------------------------ */
function defaultData() {
  return {
    seq: {
      alunos: 6, voluntarios: 5, disciplinas: 7, atividades: 5,
      progressos: 4, kanban: 7
    },
    alunos: [
      { id: 1, nome: 'Ana Beatriz Sousa', data_nascimento: '2012-04-15', serie: '6º ano', responsavel: 'Maria Sousa', telefone: '(86) 99911-2233', necessidades: 'Dificuldade em operações com frações.', created_at: now() },
      { id: 2, nome: 'Carlos Eduardo Lima', data_nascimento: '2011-08-02', serie: '7º ano', responsavel: 'José Lima', telefone: '(86) 98822-3344', necessidades: 'Reforço em interpretação de texto.', created_at: now() },
      { id: 3, nome: 'Maria Clara Rocha', data_nascimento: '2013-01-20', serie: '5º ano', responsavel: 'Patrícia Rocha', telefone: '(86) 97733-4455', necessidades: null, created_at: now() },
      { id: 4, nome: 'João Pedro Alves', data_nascimento: '2010-11-30', serie: '8º ano', responsavel: 'Antônio Alves', telefone: '(86) 96644-5566', necessidades: 'Defasagem em inglês e matemática.', created_at: now() },
      { id: 5, nome: 'Laura Fernanda Costa', data_nascimento: '2014-06-10', serie: '4º ano', responsavel: 'Fernanda Costa', telefone: '(86) 95555-6677', necessidades: 'Alfabetização em andamento.', created_at: now() }
    ],
    voluntarios: [
      { id: 1, nome: 'Renata Oliveira', email: 'renata.oliveira@example.com', telefone: '(86) 91234-0001', area_atuacao: 'Matemática', disponibilidade: 'Terças e quintas à tarde', created_at: now() },
      { id: 2, nome: 'Paulo Henrique', email: 'paulo.henrique@example.com', telefone: '(86) 91234-0002', area_atuacao: 'Língua Portuguesa', disponibilidade: 'Sábados pela manhã', created_at: now() },
      { id: 3, nome: 'Camila Duarte', email: 'camila.duarte@example.com', telefone: '(86) 91234-0003', area_atuacao: 'Inglês', disponibilidade: 'Segundas e quartas à tarde', created_at: now() },
      { id: 4, nome: 'Marcos Paulo Araújo', email: 'marcos.araujo@example.com', telefone: '(86) 91234-0004', area_atuacao: 'Informática / Inclusão Digital', disponibilidade: 'Sextas à tarde', created_at: now() }
    ],
    disciplinas: [
      { id: 1, nome: 'Matemática' },
      { id: 2, nome: 'Língua Portuguesa' },
      { id: 3, nome: 'Ciências' },
      { id: 4, nome: 'História' },
      { id: 5, nome: 'Geografia' },
      { id: 6, nome: 'Inglês' }
    ],
    atividades: [
      { id: 1, titulo: 'Aula de frações', descricao: 'Revisão de frações e exercícios práticos em grupo.', disciplina_id: 1, voluntario_id: 1, data: '2026-09-16', horario: '14:00:00', status: 'concluida', aluno_ids: [1, 4], created_at: now() },
      { id: 2, titulo: 'Leitura e interpretação', descricao: 'Oficina de leitura com contação de histórias.', disciplina_id: 2, voluntario_id: 2, data: '2026-09-19', horario: '09:00:00', status: 'planejada', aluno_ids: [2, 5], created_at: now() },
      { id: 3, titulo: 'Inglês básico', descricao: 'Vocabulário e conversação para iniciantes.', disciplina_id: 6, voluntario_id: 3, data: '2026-09-21', horario: '15:00:00', status: 'planejada', aluno_ids: [4], created_at: now() },
      { id: 4, titulo: 'Inclusão digital', descricao: 'Primeiros passos no computador e internet segura.', disciplina_id: 1, voluntario_id: 4, data: '2026-09-25', horario: '15:00:00', status: 'planejada', aluno_ids: [1, 2, 4], created_at: now() }
    ],
    progressos: [
      { id: 1, aluno_id: 1, disciplina_id: 1, atividade_id: 1, avaliacao: 'Bom progresso', nota: 7.5, observacao: 'Compreendeu o conceito de frações equivalentes.', data: '2026-09-16', created_at: now() },
      { id: 2, aluno_id: 4, disciplina_id: 1, atividade_id: 1, avaliacao: 'Em desenvolvimento', nota: 5.0, observacao: 'Necessita de mais prática com denominadores.', data: '2026-09-16', created_at: now() },
      { id: 3, aluno_id: 2, disciplina_id: 2, atividade_id: 2, avaliacao: 'Ótimo desempenho', nota: 9.0, observacao: 'Leitura fluente e boa compreensão.', data: '2026-09-19', created_at: now() }
    ],
    kanban_tarefas: [
      { id: 1, titulo: 'Levantar requisitos com a associação', descricao: 'Entrevistas com coordenadores e voluntários do bairro Uruguai.', coluna: 'concluido', created_at: now() },
      { id: 2, titulo: 'Modelar diagramas de caso de uso', descricao: 'Elaborar diagrama de casos de uso da plataforma.', coluna: 'concluido', created_at: now() },
      { id: 3, titulo: 'Criar protótipos de telas', descricao: 'Validar wireframes com os usuários da comunidade.', coluna: 'em_andamento', created_at: now() },
      { id: 4, titulo: 'Implementar módulo de alunos', descricao: 'CRUD de alunos e responsáveis.', coluna: 'em_andamento', created_at: now() },
      { id: 5, titulo: 'Implementar módulo de voluntários', descricao: 'Cadastro e capacitação de voluntários.', coluna: 'a_fazer', created_at: now() },
      { id: 6, titulo: 'Coletar evidências de melhoria', descricao: 'Relatórios de impacto e feedback da comunidade.', coluna: 'a_fazer', created_at: now() }
    ]
  };
}

function now() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/* ------------------------------------------------------------------ */
/* Backend de arquivo (fallback sem MySQL)                             */
/* ------------------------------------------------------------------ */
function createFileStore() {
  let data;
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } else {
    data = defaultData();
    persist(data);
  }
  function persist(d) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));
  }
  const next = (key) => ++data.seq[key];
  const byId = (arr, id) => arr.find((x) => x.id === Number(id));
  const name = (arr, id) => byId(arr, id)?.nome ?? null;

  return {
    backend: 'file',
    getAlunos: async () => [...data.alunos].sort((a, b) => a.nome.localeCompare(b.nome)),
    createAluno: async (f) => { const id = next('alunos'); data.alunos.push({ id, ...f, created_at: now() }); persist(data); return id; },
    updateAluno: async (id, f) => { Object.assign(byId(data.alunos, id), f); persist(data); },
    deleteAluno: async (id) => { data.alunos = data.alunos.filter((x) => x.id !== Number(id)); data.progressos = data.progressos.filter((p) => p.aluno_id !== Number(id)); persist(data); },

    getVoluntarios: async () => [...data.voluntarios].sort((a, b) => a.nome.localeCompare(b.nome)),
    createVoluntario: async (f) => { const id = next('voluntarios'); data.voluntarios.push({ id, ...f, created_at: now() }); persist(data); return id; },
    updateVoluntario: async (id, f) => { Object.assign(byId(data.voluntarios, id), f); persist(data); },
    deleteVoluntario: async (id) => { data.voluntarios = data.voluntarios.filter((x) => x.id !== Number(id)); persist(data); },

    getDisciplinas: async () => [...data.disciplinas].sort((a, b) => a.nome.localeCompare(b.nome)),
    createDisciplina: async (f) => { const id = next('disciplinas'); data.disciplinas.push({ id, ...f }); persist(data); return id; },

    getAtividades: async () => [...data.atividades]
      .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
      .map((a) => ({
        ...a,
        disciplina: name(data.disciplinas, a.disciplina_id),
        voluntario: name(data.voluntarios, a.voluntario_id),
        alunos: (a.aluno_ids || []).map((id) => ({ id, nome: name(data.alunos, id) })).filter((x) => x.nome)
      })),
    createAtividade: async (f, alunoIds) => { const id = next('atividades'); data.atividades.push({ ...f, aluno_ids: alunoIds, created_at: now() }); persist(data); return id; },
    updateAtividade: async (id, f, alunoIds) => { Object.assign(byId(data.atividades, id), f, { aluno_ids: alunoIds }); persist(data); },
    deleteAtividade: async (id) => { data.atividades = data.atividades.filter((x) => x.id !== Number(id)); persist(data); },

    getProgressos: async (alunoId) => [...data.progressos]
      .filter((p) => !alunoId || p.aluno_id === Number(alunoId))
      .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
      .map((p) => ({ ...p, aluno: name(data.alunos, p.aluno_id), disciplina: name(data.disciplinas, p.disciplina_id) })),
    createProgresso: async (f) => { const id = next('progressos'); data.progressos.push({ ...f, created_at: now() }); persist(data); return id; },
    deleteProgresso: async (id) => { data.progressos = data.progressos.filter((x) => x.id !== Number(id)); persist(data); },

    getKanban: async () => [...data.kanban_tarefas].sort((a, b) => b.id - a.id),
    createKanban: async (f) => { const id = next('kanban'); data.kanban_tarefas.push({ id, ...f, created_at: now() }); persist(data); return id; },
    updateKanban: async (id, f) => { Object.assign(byId(data.kanban_tarefas, id), f); persist(data); },
    deleteKanban: async (id) => { data.kanban_tarefas = data.kanban_tarefas.filter((x) => x.id !== Number(id)); persist(data); },

    getDashboard: async () => {
      const notas = data.progressos.filter((p) => p.nota != null).map((p) => Number(p.nota));
      const media = notas.length ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10 : null;
      const kanban = ['a_fazer', 'em_andamento', 'concluido'].map((c) => ({ coluna: c, qtd: data.kanban_tarefas.filter((k) => k.coluna === c).length }));
      return {
        alunos: data.alunos.length,
        voluntarios: data.voluntarios.length,
        atividades: data.atividades.length,
        progressos: data.progressos.length,
        media_notas: media,
        kanban
      };
    }
  };
}

/* ------------------------------------------------------------------ */
/* Backend MySQL                                                       */
/* ------------------------------------------------------------------ */
function createMysqlStore(pool) {
  return {
    backend: 'mysql',
    getAlunos: async () => (await pool.query('SELECT * FROM alunos ORDER BY nome'))[0],
    createAluno: async (f) => (await pool.query('INSERT INTO alunos (nome, data_nascimento, serie, responsavel, telefone, necessidades) VALUES (?, ?, ?, ?, ?, ?)', [f.nome, f.data_nascimento || null, f.serie || null, f.responsavel || null, f.telefone || null, f.necessidades || null]))[0].insertId,
    updateAluno: async (id, f) => pool.query('UPDATE alunos SET nome = ?, data_nascimento = ?, serie = ?, responsavel = ?, telefone = ?, necessidades = ? WHERE id = ?', [f.nome, f.data_nascimento || null, f.serie || null, f.responsavel || null, f.telefone || null, f.necessidades || null, id]),
    deleteAluno: async (id) => pool.query('DELETE FROM alunos WHERE id = ?', [id]),

    getVoluntarios: async () => (await pool.query('SELECT * FROM voluntarios ORDER BY nome'))[0],
    createVoluntario: async (f) => (await pool.query('INSERT INTO voluntarios (nome, email, telefone, area_atuacao, disponibilidade) VALUES (?, ?, ?, ?, ?)', [f.nome, f.email || null, f.telefone || null, f.area_atuacao || null, f.disponibilidade || null]))[0].insertId,
    updateVoluntario: async (id, f) => pool.query('UPDATE voluntarios SET nome = ?, email = ?, telefone = ?, area_atuacao = ?, disponibilidade = ? WHERE id = ?', [f.nome, f.email || null, f.telefone || null, f.area_atuacao || null, f.disponibilidade || null, id]),
    deleteVoluntario: async (id) => pool.query('DELETE FROM voluntarios WHERE id = ?', [id]),

    getDisciplinas: async () => (await pool.query('SELECT * FROM disciplinas ORDER BY nome'))[0],
    createDisciplina: async (f) => (await pool.query('INSERT INTO disciplinas (nome) VALUES (?)', [f.nome]))[0].insertId,

    getAtividades: async () => {
      const [rows] = await pool.query(`SELECT a.*, d.nome AS disciplina, v.nome AS voluntario FROM atividades a LEFT JOIN disciplinas d ON d.id = a.disciplina_id LEFT JOIN voluntarios v ON v.id = a.voluntario_id ORDER BY a.data DESC, a.horario ASC`);
      for (const a of rows) {
        const [alunos] = await pool.query('SELECT al.id, al.nome FROM atividade_alunos aa JOIN alunos al ON al.id = aa.aluno_id WHERE aa.atividade_id = ? ORDER BY al.nome', [a.id]);
        a.alunos = alunos;
      }
      return rows;
    },
    createAtividade: async (f, alunoIds) => {
      const id = (await pool.query('INSERT INTO atividades (titulo, descricao, disciplina_id, voluntario_id, data, horario, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [f.titulo, f.descricao || null, f.disciplina_id || null, f.voluntario_id || null, f.data || null, f.horario || null, f.status || 'planejada']))[0].insertId;
      for (const alunoId of alunoIds) await pool.query('INSERT INTO atividade_alunos (atividade_id, aluno_id) VALUES (?, ?)', [id, alunoId]);
      return id;
    },
    updateAtividade: async (id, f, alunoIds) => {
      await pool.query('UPDATE atividades SET titulo = ?, descricao = ?, disciplina_id = ?, voluntario_id = ?, data = ?, horario = ?, status = ? WHERE id = ?', [f.titulo, f.descricao || null, f.disciplina_id || null, f.voluntario_id || null, f.data || null, f.horario || null, f.status || 'planejada', id]);
      await pool.query('DELETE FROM atividade_alunos WHERE atividade_id = ?', [id]);
      for (const alunoId of alunoIds) await pool.query('INSERT INTO atividade_alunos (atividade_id, aluno_id) VALUES (?, ?)', [id, alunoId]);
    },
    deleteAtividade: async (id) => pool.query('DELETE FROM atividades WHERE id = ?', [id]),

    getProgressos: async (alunoId) => {
      const params = [];
      let where = '';
      if (alunoId) { where = 'WHERE p.aluno_id = ?'; params.push(alunoId); }
      return (await pool.query(`SELECT p.*, al.nome AS aluno, d.nome AS disciplina FROM progressos p JOIN alunos al ON al.id = p.aluno_id LEFT JOIN disciplinas d ON d.id = p.disciplina_id ${where} ORDER BY p.data DESC`, params))[0];
    },
    createProgresso: async (f) => (await pool.query('INSERT INTO progressos (aluno_id, disciplina_id, atividade_id, avaliacao, nota, observacao, data) VALUES (?, ?, ?, ?, ?, ?, ?)', [f.aluno_id, f.disciplina_id || null, f.atividade_id || null, f.avaliacao || null, f.nota ?? null, f.observacao || null, f.data || null]))[0].insertId,
    deleteProgresso: async (id) => pool.query('DELETE FROM progressos WHERE id = ?', [id]),

    getKanban: async () => (await pool.query('SELECT * FROM kanban_tarefas ORDER BY created_at DESC'))[0],
    createKanban: async (f) => (await pool.query('INSERT INTO kanban_tarefas (titulo, descricao, coluna) VALUES (?, ?, ?)', [f.titulo, f.descricao || null, f.coluna || 'a_fazer']))[0].insertId,
    updateKanban: async (id, f) => pool.query('UPDATE kanban_tarefas SET titulo = ?, descricao = ?, coluna = ? WHERE id = ?', [f.titulo, f.descricao || null, f.coluna || 'a_fazer', id]),
    deleteKanban: async (id) => pool.query('DELETE FROM kanban_tarefas WHERE id = ?', [id]),

    getDashboard: async () => {
      const [[{ alunos }]] = await pool.query('SELECT COUNT(*) AS alunos FROM alunos');
      const [[{ voluntarios }]] = await pool.query('SELECT COUNT(*) AS voluntarios FROM voluntarios');
      const [[{ atividades }]] = await pool.query('SELECT COUNT(*) AS atividades FROM atividades');
      const [[{ progressos }]] = await pool.query('SELECT COUNT(*) AS progressos FROM progressos');
      const [[{ media }]] = await pool.query('SELECT ROUND(AVG(nota), 1) AS media FROM progressos WHERE nota IS NOT NULL');
      const [kanban] = await pool.query('SELECT coluna, COUNT(*) AS qtd FROM kanban_tarefas GROUP BY coluna');
      return { alunos, voluntarios, atividades, progressos, media_notas: media, kanban };
    }
  };
}

/* ------------------------------------------------------------------ */
/* Inicialização: tenta MySQL, senão usa arquivo                       */
/* ------------------------------------------------------------------ */
async function init() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reforco_escolar',
    connectTimeout: 2500,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true
  });
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[store] Conectado ao MySQL.');
    return createMysqlStore(pool);
  } catch (err) {
    console.warn(`[store] MySQL indisponível (${err.code || err.message}). Usando armazenamento local em data/db.json.`);
    try { await pool.end(); } catch (_) { /* ignore */ }
    return createFileStore();
  }
}

module.exports = { init };
