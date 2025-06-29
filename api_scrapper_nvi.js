const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3010;

app.get('/versiculo', async (req, res) => {
  let { livro, capitulo, versiculo, versao } = req.query
  


  if (!livro || !capitulo || !versiculo) {
    return res.status(400).json({
      erro: 'Parâmetros obrigatórios: livro, capitulo, versiculo'
    });
  }

  const url = `http://bibliaonline.com.br/${versao}/${livro}/${capitulo}/${versiculo}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Selecionando pela combinação das classes
    // const texto = $('div.font-sans.text-xl.lg\\:text-2xl.xl\\:text-3xl').text().trim();

    const texto = $('.FragmentView_text__g6Uq2.FragmentView_verseByVerse__l1TB0 span.t').text().trim()
    console.log(`Livro: ${livro}, Capitulo: ${capitulo}, Versiculo: ${versiculo}, Texto: ${texto}`)


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
