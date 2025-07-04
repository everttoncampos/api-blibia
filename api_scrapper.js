const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3010;

app.get('/versiculo', async (req, res) => {
  const { livro, capitulo, versiculo } = req.query;

  if (!livro || !capitulo || !versiculo) {
    return res.status(400).json({
      erro: 'Parâmetros obrigatórios: livro, capitulo, versiculo'
    });
  }

  const url = `https://bkjfiel.com.br/${livro}-${capitulo}-${versiculo}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);

    // Selecionando pela combinação das classes
    // const texto = $('div.font-sans.text-xl.lg\\:text-2xl.xl\\:text-3xl').text().trim();

    const texto = $('div.font-sans.text-xl.lg\\:text-2xl.xl\\:text-3xl').text()
  .replace(/\s+/g, ' ')  // substitui múltiplos espaços e quebras por um só espaço
  .replace(/"\s+/g, '"') // remove espaços depois de aspas de abertura
  .replace(/\s+"/g, '"') // remove espaços antes de aspas de fechamento
  .trim();

    console.log(texto);

    if (!texto) {
      return res.status(404).json({ erro: 'Versículo não encontrado' });
    }

    res.json({
      livro,
      capitulo,
      versiculo,
      texto
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao acessar o site', detalhe: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});
