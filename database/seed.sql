USE reforco_escolar;

-- Disciplinas
INSERT INTO disciplinas (nome) VALUES
  ('Matemática'),
  ('Língua Portuguesa'),
  ('Ciências'),
  ('História'),
  ('Geografia'),
  ('Inglês');

-- Alunos
INSERT INTO alunos (nome, data_nascimento, serie, responsavel, telefone, necessidades) VALUES
  ('Ana Beatriz Sousa', '2012-04-15', '6º ano', 'Maria Sousa', '(86) 99911-2233', 'Dificuldade em operações com frações.'),
  ('Carlos Eduardo Lima', '2011-08-02', '7º ano', 'José Lima', '(86) 98822-3344', 'Reforço em interpretação de texto.'),
  ('Maria Clara Rocha', '2013-01-20', '5º ano', 'Patrícia Rocha', '(86) 97733-4455', NULL),
  ('João Pedro Alves', '2010-11-30', '8º ano', 'Antônio Alves', '(86) 96644-5566', 'Defasagem em inglês e matemática.'),
  ('Laura Fernanda Costa', '2014-06-10', '4º ano', 'Fernanda Costa', '(86) 95555-6677', 'Alfabetização em andamento.');

-- Voluntários
INSERT INTO voluntarios (nome, email, telefone, area_atuacao, disponibilidade) VALUES
  ('Renata Oliveira', 'renata.oliveira@example.com', '(86) 91234-0001', 'Matemática', 'Terças e quintas à tarde'),
  ('Paulo Henrique', 'paulo.henrique@example.com', '(86) 91234-0002', 'Língua Portuguesa', 'Sábados pela manhã'),
  ('Camila Duarte', 'camila.duarte@example.com', '(86) 91234-0003', 'Inglês', 'Segundas e quartas à tarde'),
  ('Vítor Emanuel Pacheco de Sousa', 'vitor.sousa@example.com', '(86) 91234-0004', 'Informática / Inclusão Digital', 'Sextas à tarde');

-- Atividades
INSERT INTO atividades (titulo, descricao, disciplina_id, voluntario_id, data, horario, status) VALUES
  ('Aula de frações', 'Revisão de frações e exercícios práticos em grupo.', 1, 1, '2026-09-16', '14:00:00', 'concluida'),
  ('Leitura e interpretação', 'Oficina de leitura com contação de histórias.', 2, 2, '2026-09-19', '09:00:00', 'planejada'),
  ('Inglês básico', 'Vocabulário e conversação para iniciantes.', 6, 3, '2026-09-21', '15:00:00', 'planejada'),
  ('Inclusão digital', 'Primeiros passos no computador e internet segura.', 1, 4, '2026-09-25', '15:00:00', 'planejada');

INSERT INTO atividade_alunos (atividade_id, aluno_id) VALUES
  (1, 1), (1, 4),
  (2, 2), (2, 5),
  (3, 4),
  (4, 1), (4, 2), (4, 4);

-- Progressos
INSERT INTO progressos (aluno_id, disciplina_id, atividade_id, avaliacao, nota, observacao, data) VALUES
  (1, 1, 1, 'Bom progresso', 7.5, 'Compreendeu o conceito de frações equivalentes.', '2026-09-16'),
  (4, 1, 1, 'Em desenvolvimento', 5.0, 'Necessita de mais prática com denominadores.', '2026-09-16'),
  (2, 2, 2, 'Ótimo desempenho', 9.0, 'Leitura fluente e boa compreensão.', '2026-09-19');

-- Quadro Kanban
INSERT INTO kanban_tarefas (titulo, descricao, coluna) VALUES
  ('Levantar requisitos com a associação', 'Entrevistas com coordenadores e voluntários do bairro Uruguai.', 'concluido'),
  ('Modelar diagramas de caso de uso', 'Elaborar diagrama de casos de uso da plataforma.', 'concluido'),
  ('Criar protótipos de telas', 'Validar wireframes com os usuários da comunidade.', 'em_andamento'),
  ('Implementar módulo de alunos', 'CRUD de alunos e responsáveis.', 'em_andamento'),
  ('Implementar módulo de voluntários', 'Cadastro e capacitação de voluntários.', 'a_fazer'),
  ('Coletar evidências de melhoria', 'Relatórios de impacto e feedback da comunidade.', 'a_fazer');
