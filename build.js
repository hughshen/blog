const fs = require('fs');
const path = require('path');
const marked = require('marked');
const minify = require('html-minifier').minify;
const less = require('less');

const minifyOptions = require('./helper').minifyOptions;
const markedOptions = require('./helper').markedOptions;
const deleteFolderRecursive = require('./helper').deleteFolderRecursive;
const buildTag = require('./helper').buildTag;
const config = require('./app/config');

const posts = fs.readdirSync(config.folder.mdPath, 'utf-8').reverse();

// Set marked options
marked.setOptions(markedOptions);

// Delete static directory if exists
deleteFolderRecursive(`./${config.folder.static}`);
console.log('Create static directory ...');
fs.mkdirSync(`./${config.folder.static}`);
console.log('Create post directory ...');
fs.mkdirSync(`./${config.folder.static}/${config.folder.staticPost}`);

// Sitemap
let sitemap = '';
// Home posts list
let itemsList = '';
// Posts data array
let itemsData = posts.map((fileName, key) => {
    let timestamp = fileName.match(/[\d]{13}/i)[0];
    let date = new Date(parseFloat(timestamp));
    let urlTitle = fileName.slice(0, -3).replace(/[\d]{13}-/i, '');
    let shortDate = date.toISOString().slice(0, 10);
    let longDate = date.toISOString().slice(0, 10) + ' ' + date.toTimeString().slice(0, 8);
    let mdText = fs.readFileSync(path.resolve(__dirname, `${config.folder.mdPath}/${fileName}`), 'utf-8');
    let showClass = key < config.homeConfig.showItems ? config.homeConfig.showClass : '';

    sitemap = `${sitemap}
    <url>
        <loc>${config.siteUrl}/${config.folder.staticPost}/${urlTitle}.html</loc>
        <lastmod>${shortDate}</lastmod>
    </url>`;

    itemsList += `<li class="${showClass}"><time datetime="${date.toISOString()}" itemprop="datePublished">${shortDate}</time><a href="${config.folder.staticPost}/${urlTitle}.html">${config.postConfig.getTitle(mdText)}</a></li>`;

    return {
        date: date,
        urlTitle: urlTitle,
        mdText: mdText,
    };
});

less.render(fs.readFileSync(config.homeConfig.style, 'utf-8'), {
    paths: [config.folder.assetsLess],
    compress: true,
}, (err, output) => {
    if (err) throw err;
    // Write index.html
    console.log('Writing index.html ...');
    config.renderClear();
    config.setBeforeHead(config.homeConfig.getHead());
    config.setBeforeHead(buildTag('style', output.css));
    config.setBeforeBody(config.homeConfig.getBody());
    config.setRenderContent(`<ul id="list">${itemsList}</ul>`);
    config.setRenderContent(config.homeConfig.getContent());
    fs.writeFileSync(path.resolve(__dirname, `${config.folder.static}/index.html`), minify(config.render(), minifyOptions));
    // Write sitemap.xml
    if (config.sitemap) {
        console.log('Writing sitemap.xml ...');
        fs.writeFileSync(path.resolve(__dirname, `${config.folder.static}/sitemap.xml`), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}
</urlset>`);
    }
});

less.render(fs.readFileSync(config.postConfig.style, 'utf-8'), {
    paths: [config.folder.assetsLess],
    compress: true,
}, (err, output) => {
    if (err) throw err;
    // Start to generate post static file
    itemsData.map(post => {
        config.renderClear();
        config.setBeforeHead(`${config.postConfig.getMetaTags(post.mdText)}`);
        config.setBeforeHead(config.postConfig.getHead());
        config.setBeforeHead(buildTag('style', output.css));
        config.setBeforeBody(config.postConfig.getBody());
        config.setRenderContent(`<article><div class="head"><h1>${config.postConfig.getTitle(post.mdText)}</h1><time datetime="${post.date.toISOString()}" itemprop="datePublished">${post.date.toDateString().slice(4)}</time></div><div class="body">${marked(post.mdText)}</div></article>`);
        config.setRenderContent(config.postConfig.getContent());
        fs.writeFileSync(path.resolve(__dirname, `${config.folder.static}/${config.folder.staticPost}/${post.urlTitle}.html`), minify(config.render(), minifyOptions));
        console.log(`${post.urlTitle}.html has been written ...`);
    });
});
