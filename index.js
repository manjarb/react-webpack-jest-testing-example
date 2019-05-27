import express from 'express';
import bodyParser from 'body-parser';
import formidable from 'formidable';
import path from 'path';
import fs, { rename } from 'fs';
import summariseRoute from './routes/summariseRoute';
import apiRoute from './routes/apiRoutes';

import { getRandomString, getExtensionName } from './flow/helper/upload-helper';

import { version } from './helper/variables';

const uploadXmlFolder = path.join(__dirname, '/data/uploads/xml/');
const uploadPackageFolder = path.join(__dirname, '/data/uploads/package/');

const app = express();

app.use(`${version}/api/**`, bodyParser.json());

app.use(`${version}/upload/package/**`, (function(req, res, next) {
    try {
        if (!fs.existsSync(uploadPackageFolder)) {
            fs.mkdirSync(uploadPackageFolder);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }

    const generateFileName = Date.now() + '-' + getRandomString(12);
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = uploadXmlFolder;

    form.on('error', function(err) {
        res.status(500).json({ error: 'Failed to write Package file' });
    });

    form.on('fileBegin', function (name, file){
        const jsonFile = JSON.parse(JSON.stringify(file));
        const extension = getExtensionName(jsonFile.name);
        file.path = uploadPackageFolder + generateFileName + '.' + extension;
    });

    form.parse(req, function (err, fields, files) {
        // Object.assign(req, {fields, files});
        Object.assign(req, {fields, files, fileName: generateFileName});
        next();
    });
}));

apiRoute(app);
summariseRoute(app);

if (process.env.NODE_ENV === 'production') {
    // Express wil serve up production assets
    // like main.js, main.css
    app.use(express.static('client/dist'));

    // Express will serve up the index.hml file
    // if does not recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;
app.timeout = 300000;
const server = app.listen(PORT);

export default server;
