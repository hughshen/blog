const fs = require('fs');
const marked = require('marked');
const minify = require('html-minifier').minify;
const less = require('less');
const minifyOptions = require('./helper').minifyOptions;
const markedOptions = require('./helper').markedOptions;
const deleteFolderRecursive = require('./helper').deleteFolderRecursive;
const buildTag = require('./helper').buildTag;
const config = require('./app/config');
const posts = fs.readdirSync(config.postsDir, 'utf-8').reverse();

// Set marked options
marked.setOptions(markedOptions);

// Delete static directory if exists
deleteFolderRecursive(config.staticDir);
console.log('Create static directory ...');
fs.mkdirSync(config.staticDir);
console.log('Create static post directory ...');
fs.mkdirSync(`${config.staticDir}/${config.staticPostDir}`);

// Init document style
let outputStyle = '';
less.render(fs.readFileSync(config.styleFile, 'utf-8'), {
    compress: true,
}, (err, output) => {
    if (err) throw err;
    outputStyle = output.css;
});
// Replace style for layout
let layout = config.layout.replace(config.styleComment, `<style>${outputStyle}</style>`);

let items = posts.map((fileName, key) => {
    let timestamp = fileName.match(/[\d]{13}/i)[0];
    let date = new Date(parseFloat(timestamp));
    let urlTitle = fileName.slice(0, -3).replace(/[\d]{13}-/i, '');
    let postTitle = urlTitle;
    let shortDate = date.toISOString().slice(0, 10);
    let longDate = date.toISOString().slice(0, 10) + ' ' + date.toTimeString().slice(0, 8);
    let blockClass = 'block ' + (key % 2 == 0 ? 'left' : 'right');
    let mdText = fs.readFileSync(`${config.postsDir}/${fileName}`, 'utf-8');
    let showClass = key < config.showItems ? 'show' : '';

    // Meta tag
    let metaTags = '';
    let tempMatch = mdText.match(/<!--\s*title:(.*)\s*-->/i);
    if (tempMatch && typeof tempMatch[1] !== 'undefined') {
        postTitle = tempMatch[1];
        metaTags = metaTags + buildTag('title', tempMatch[1]);
    }
    tempMatch = mdText.match(/<!--\s*keywords:(.*)\s*-->/i);
    if (tempMatch && typeof tempMatch[1] !== 'undefined') {
        metaTags = metaTags + buildTag('meta', 'name', 'keywords', 'content', tempMatch[1]);
    }
    tempMatch = mdText.match(/<!--\s*description:(.*)\s*-->/i);
    if (tempMatch && typeof tempMatch[1] !== 'undefined') {
        metaTags = metaTags + buildTag('meta', 'name', 'description', 'content', tempMatch[1]);
    }

    // Start to write post html file
    fs.writeFileSync(`${config.staticDir}/${config.staticPostDir}/${urlTitle}.html`, minify(layout.replace(config.contentComment, `<article><div class="head"><h1>${postTitle}</h1><span class="ps">${date.toDateString().slice(4)}</span></div><div class="body">${marked(mdText)}</div></article>`).replace(config.metaComment, metaTags), minifyOptions));

    console.log(`${urlTitle} has been written ...`);

    return `<li class="${showClass}"><time date="${date}">${shortDate}</time><a href="${config.staticPostDir}/${urlTitle}.html">${postTitle}</a></li>`;
})

// Writing index.html
let metaTags = '';
if (config.title.length) {
    metaTags = metaTags + buildTag('title', config.title);
}
if (config.keywords.length) {
    metaTags = metaTags + buildTag('meta', 'name', 'keywords', 'content', config.keywords);
}
if (config.description.length) {
    metaTags = metaTags + buildTag('meta', 'name', 'description', 'content', config.description);
}

console.log('Writing index.html ...');
fs.writeFileSync(`${config.staticDir}/index.html`, minify(layout.replace(config.contentComment, `<ul id="list">${items.join('')}</ul><div id="page"><a href="javascript:;" class="prev" onclick="page.prev()">&lt;&nbsp;Prev</a><a href="javascript:;" class="next" onclick="page.next()">Next&nbsp;&gt;</a></div>`).replace(config.metaComment, metaTags), minifyOptions));
