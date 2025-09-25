import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

const { Pool } = pkg; 

let pool = null; 

function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}


app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada");

  const db = conectarBD();

  let dbStatus = "ok";

  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }

  res.json({
    message: "API para questões",
    author: "Maria Eloísa Costa Silva",
    dbStatus: dbStatus,
  });
});

app.get("/questoes", async (req, res) => {
  console.log("Rota GET /questoes solicitada");
  
  const db = conectarBD();

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

app.listen(port, () => {
  console.log(`Serviço rodando na porta:  ${port}`);
});
