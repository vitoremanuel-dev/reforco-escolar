# Banco de dados da Plataforma de Reforço Escolar
CREATE DATABASE IF NOT EXISTS reforco_escolar
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reforco_escolar;

CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  data_nascimento DATE,
  serie VARCHAR(40),
  responsavel VARCHAR(120),
  telefone VARCHAR(20),
  necessidades TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voluntarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120),
  telefone VARCHAR(20),
  area_atuacao VARCHAR(80),
  disponibilidade VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(160) NOT NULL,
  descricao TEXT,
  disciplina_id INT,
  voluntario_id INT,
  data DATE,
  horario TIME,
  status ENUM('planejada', 'em_andamento', 'concluida') DEFAULT 'planejada',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_atv_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas (id) ON DELETE SET NULL,
  CONSTRAINT fk_atv_voluntario FOREIGN KEY (voluntario_id) REFERENCES voluntarios (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS atividade_alunos (
  atividade_id INT NOT NULL,
  aluno_id INT NOT NULL,
  PRIMARY KEY (atividade_id, aluno_id),
  CONSTRAINT fk_aa_atividade FOREIGN KEY (atividade_id) REFERENCES atividades (id) ON DELETE CASCADE,
  CONSTRAINT fk_aa_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progressos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  disciplina_id INT,
  atividade_id INT,
  avaliacao VARCHAR(40),
  nota DECIMAL(4, 1),
  observacao TEXT,
  data DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prog_aluno FOREIGN KEY (aluno_id) REFERENCES alunos (id) ON DELETE CASCADE,
  CONSTRAINT fk_prog_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas (id) ON DELETE SET NULL,
  CONSTRAINT fk_prog_atividade FOREIGN KEY (atividade_id) REFERENCES atividades (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS kanban_tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(160) NOT NULL,
  descricao TEXT,
  coluna ENUM('a_fazer', 'em_andamento', 'concluido') DEFAULT 'a_fazer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
