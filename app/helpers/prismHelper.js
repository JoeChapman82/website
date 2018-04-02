module.exports = (text, startNum, toRemove) => {
    return text.split('\n').splice(toRemove).map((line, index) => {
        return `<span data-c-ln="${startNum++}">${line}</span>`;
    }).join('\n');
};
