const fs = require('fs');
const marked = require('marked');
const highlightjs = require('highlightjs');

const minifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
};

const markedOptions = {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
        return highlightjs.highlightAuto(code).value;
    }
};

// https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
const deleteFolderRecursive = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            let curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const buildTag = (tag, ...args) => {
    const selfCloseTags = ['br', 'hr', 'img', 'input', 'meta'];
    let html = '';
    let props = '';
    let content = '';
    let isSelfCloseTag = selfCloseTags.indexOf(tag) === -1;

    if (typeof tag !== 'string' || tag.length == 0) return html;

    args.map((val, key) => {
        if (key == 0 && isSelfCloseTag) {
            content = val;
        } else {
            if (props.slice(-1) == '=') {
                props = props + `"${val}"`;
            } else {
                props = props + ` ${val}=`;
            }
        }
    });

    if (isSelfCloseTag) {
        html = `<${tag}${props}>${content}</${tag}>`;
    } else {
        html = `<${tag}${props}>` ;
    }

    return html;
}

module.exports = {
    minifyOptions,
    markedOptions,
    deleteFolderRecursive,
    buildTag
};
