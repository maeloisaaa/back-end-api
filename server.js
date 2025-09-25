import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();         // Carrega e processa o arquivo .env
const { Pool } = pkg;    // Utiliza a Classe Pool do Postgres
import express from "express";
const app = express();
const port = 3000;


app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada");
  const db = new Pool({
    connectionString: process.env.URL_BD,
  });
  let dbStatus = "ok";
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }
  res.json({
    message: "API para controle de gastos pessoais",
    author: "Maria Eloísa Costa Silva",
    statusBD: dbStatus
  });
});

app.listen(port, () => {
  console.log(`Serviço rodando na porta: ${port}`);
});


// Nova rota para retornar todas as questões cadastradas
app.get("/questoes", async (req, res) => {
  console.log("Rota GET /questoes solicitada");
  const db = new Pool({
    connectionString: process.env.URL_BD,
  });
  try {
    const resultado = await db.query("SELECT * FROM questoes");
    const dados = resultado.rows;
    res.json(dados);
  } catch (e) {
    console.error("Erro ao buscar questões:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as questões",
    });
  }
});
