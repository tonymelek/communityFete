//Define Dependencies
const express = require('express');
const router = express.Router();
const tinify = require("tinify");
const multer = require('multer')
const path = require('path');
const fs = require('fs');

tinify.key = process.env.tinify;

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './tempUploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('userPhoto');


router.get('/test', (req, res) => {
    let result = []
    const temp_path = path.join('__dirname', '../tempUploads');
    fs.readdirSync(temp_path).forEach(file => {
        fs.unlinkSync(path.join(temp_path, file))
        result.push(file)
    })
    res.json(result)
})

router.post('/test', upload, (req, res) => {
    const temp_path = path.join('__dirname', '../tempUploads');
    fs.readdirSync(temp_path).forEach(file => {
        fs.unlinkSync(path.join(temp_path, file))
    })
    const source = tinify.fromFile(`./tempUploads/${req.file.originalname}`);
    const resized = source.resize({
        method: "fit",
        width: 150,
        height: 150
    });
    resized.toFile(path.join(__dirname, '../client/public', 'menu', `${req.file.originalname}`));
    res.send('created successfully')

})



//export router
module.exports = router