const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.post('/convert', upload.single('audio'), (req, res) => {
  const inputFile = req.file.path;
  const outputFile = `uploads/${req.file.filename}.mp3`;

  ffmpeg(inputFile)
    .toFormat('mp3')
    .on('end', () => {
      res.download(outputFile); // Envia o arquivo MP3 convertido
    })
    .on('error', (err) => {
      res.status(500).send(err.message);
    })
    .save(outputFile);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});