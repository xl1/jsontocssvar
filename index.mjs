import express from 'express';
import fetch from 'node-fetch';
import cssesc from 'cssesc';
import obj2cssvar from './obj2cssvar.mjs';

const app = express();
const server = app.listen(process.env.port || 8081, () => console.log('listening'));

/** @param {{ url: string, json: string, quote: boolean, root: string }} query */
async function processRequest({ url, json, quote = false, root = ':root' }) {
    if (!url && !json) {
        throw new Error('Please specify url or json parameter');
    }

    const obj = url
        ? await fetch(url).then(r => r.json())
        : JSON.parse(json);
    return obj2cssvar(obj, quote, root);
}

app.get('/css', (req, res) =>
    processRequest(req.query)
        .then(result => {
            res.writeHead(200, { 'content-type': 'text/css' });
            res.end(result);
        })
        .catch(e => {
            res.writeHead(400, { 'content-type': 'text/css' });
            res.end(`:root { --error-message: ${cssesc(e.message, { wrap: true })}; }`);
        })
);
