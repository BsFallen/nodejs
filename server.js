const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Garantir que a pasta 'uploads' exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.post('/convert', upload.single('audio'), (req, res) => {
    const inputFile = req.file.path;
    const outputFile = path.join(uploadsDir, `${req.file.filename}.mp3`);

    console.log(`Converting file: ${inputFile}`); // Log para verificar o arquivo de entrada

    ffmpeg(inputFile)
        .toFormat('mp3')
        .on('end', () => {
            console.log(`Conversion completed: ${outputFile}`); // Log para verificar a conclusão
            res.download(outputFile, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err.message}`);
                    res.status(500).send('Error sending file');
                }
                // Remover o arquivo após o download, se necessário
                fs.unlinkSync(inputFile); // Remove o arquivo OGG
                fs.unlinkSync(outputFile); // Remove o arquivo MP3
            });
        })
        .on('error', (err) => {
            console.error(`Error during conversion: ${err.message}`); // Log de erro
            res.status(500).send(err.message);
        })
        .save(outputFile);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
