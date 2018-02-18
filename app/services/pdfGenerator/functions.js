const config = require('../../config/pdfGenerator');

module.exports = {
    setFont: (doc, font, size) => {
        doc.font(font);
        doc.fontSize(size);
    },
    resetFont: (doc) => {
        doc.font(config.font);
        doc.fontSize(config.textSize);
    },
    heading: (doc, content, size) =>{
        doc.font(config.fontBold)
        .fontSize(size)
        .text(content, config.margin, doc.y, {width: config.mainContentWidth, lineGap: 3})
        .font(config.font)
        .fontSize(config.textSize);
    },
    hr: (doc, width) => {
        doc.rect(config.mainContentX, doc.y, width, 2)
        .fillAndStroke()
        .moveDown(1.5);
    },
    mainParagraph: (doc, text, options) => {
        const lineGap = options && options.lineGap ? options.lineGap : 1;
        if(options && options.bold) {
            doc.font(config.fontBold);
        }
        if(options && options.slice) {
            text = `${text.slice(0, options.slice.position)}${options.slice.input}${text.slice(options.slice.position)}`;
        }
        if(options && options.indented) {
            doc.text(text, config.margin + config.indent, doc.y, {width: config.mainContentWidth - config.indent, lineGap: lineGap});
        } else {
            doc.text(text, config.margin, doc.y, {width: config.mainContentWidth, lineGap: lineGap});
        }
        doc.font(config.font)
        .moveDown();
    },
    finalise: (doc) => {
        doc.flushPages();
        doc.end();
    }
};
