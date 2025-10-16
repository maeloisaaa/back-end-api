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
app.get("/questoes", async (req, res) => {

  const db = conectarBD();

  try {
    const resultado = await db.query("SELECT * FROM questoes"); // Executa uma consulta SQL para selecionar todas as questões
    const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
    res.json(dados); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao buscar questões:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

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
    mensagem: "API para Questões de Prova", // Substitua pelo conteúdo da sua API
    autor: "Maria Eloísa Costa Silva", // Substitua pelo seu nome
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
  // Rota para retornar uma questão pelo id
  app.get("/questoes/:id", async (req, res) => {
    console.log("Rota GET /questoes/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

    try {
      const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
      const db = conectarBD(); // Conecta ao banco de dados
      const consulta = "SELECT * FROM questoes WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
      const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
      const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

      // Verifica se a questão foi encontrada
      if (dados.length === 0) {
        return res.status(404).json({ mensagem: "Questão não encontrada" }); // Retorna erro 404 se a questão não for encontrada

      }

      res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
      console.error("Erro ao buscar questão:", e); // Log do erro no servidor
      res.status(500).json({
        erro: "Erro interno do servidor"
      });
    }
  });

app.listen(port, '0.0.0.0', () => {
  console.log(`Serviço rodando na porta:  ${port}`);
});
