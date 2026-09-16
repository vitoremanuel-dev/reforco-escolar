# Plataforma Web de Reforço Escolar — Bairro Uruguai

Aplicação full-stack desenvolvida como Trabalho Final da disciplina **Atividades
Extensionistas** (CST em Análise e Desenvolvimento de Sistemas — UNINTER).

> **Projeto:** *Plataforma Web de Reforço Escolar e Capacitação de Voluntários
> para a Comunidade* — voltada à Associação de Moradores do Bairro Uruguai,
> Teresina/PI, com foco no **ODS 04 — Educação de Qualidade**.

## Tecnologias

- **Front-end:** HTML5, CSS3 e JavaScript (vanilla)
- **Back-end:** Node.js + Express
- **Banco de dados:** MySQL

## Funcionalidades

- Cadastro e gestão de **alunos** (crianças e adolescentes em contraturno)
- Cadastro e gestão de **voluntários** (apoio pedagógico e capacitação)
- Gestão de **atividades** de reforço (aulas/oficinas, com disciplina,
  voluntário e alunos participantes)
- **Acompanhamento de progresso** (avaliações e notas por aluno)
- **Quadro Kanban** (A fazer / Em andamento / Concluído) para gestão do projeto
- **Dashboard** com indicadores e média de notas

## Como executar

### Opção 1 — Docker (recomendada)

```bash
docker compose up --build
```

Acesse <http://localhost:3000>.

### Opção 2 — Local (Node.js + MySQL)

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   # edite .env com as credenciais do seu MySQL
   ```

3. Crie o banco e carregue os dados de exemplo:

   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

Acesse <http://localhost:3000>.

## Estrutura do projeto

```
reforco-escolar/
├── server/
│   ├── index.js          # servidor Express + rotas da API
│   └── db.js             # pool de conexão MySQL (mysql2)
├── database/
│   ├── schema.sql        # criação das tabelas
│   └── seed.sql          # dados de exemplo
├── public/
│   ├── index.html        # interface (SPA)
│   ├── css/style.css     # estilos
│   └── js/app.js         # lógica do front-end
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## API

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET/POST | `/api/alunos` | Listar / cadastrar alunos |
| PUT/DELETE | `/api/alunos/:id` | Editar / excluir aluno |
| GET/POST | `/api/voluntarios` | Listar / cadastrar voluntários |
| PUT/DELETE | `/api/voluntarios/:id` | Editar / excluir voluntário |
| GET/POST | `/api/disciplinas` | Listar / cadastrar disciplinas |
| GET/POST | `/api/atividades` | Listar / cadastrar atividades |
| PUT/DELETE | `/api/atividades/:id` | Editar / excluir atividade |
| GET/POST | `/api/progressos` | Listar / cadastrar progresso |
| DELETE | `/api/progressos/:id` | Excluir registro de progresso |
| GET/POST | `/api/kanban` | Listar / cadastrar tarefa |
| PUT/DELETE | `/api/kanban/:id` | Mover/editar / excluir tarefa |
| GET | `/api/dashboard` | Indicadores gerais |
