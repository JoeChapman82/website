const PDFDocument = require('pdfkit');
const content = require('../../../content/about/cv');
const config = require('../../../config/pdfGenerator');
const functions = require('../functions');
const fs = require('fs');
const path = require('path');

module.exports = (stream, requestedStyle) => {
    const style = requestedStyle ? 'dark' : 'light';
    const time = new Date().getTime();
    let position = {x: 0, y: 0};
    let doc = new PDFDocument(config.options);
    doc.pipe(stream);
    // Page 1
    doc.rect(0, 0, doc.page.width, doc.page.height)
    .fillColor(config[style].textColour)
    .fill();
    doc.rect(config.borderWidth, config.borderWidth, doc.page.width - config.borderWidth * 2, doc.page.height - config.borderWidth * 2)
    .fillColor(config[style].backGroundColour)
    .fill()
    .moveTo(0, 0)
    .fillColor(config[style].textColour);
    functions.heading(doc, content.heading1, config.h1Size);
    functions.hr(doc, doc.page.width - config.margin * 2);
    storePosition(doc.x, doc.y);

    // top left box
    doc.rect(doc.x, doc.y, config.sideContentWidth, config.topHighlightHeight)
    .fillColor(config[style].highlightColour1)
    .fill();
    doc.image(path.join(__dirname, '../images/laptop.png'), doc.x + 25, doc.y + 25, {width: 125, height: 125});

    // bottom left box
    doc.rect(doc.x, doc.y + config.topHighlightHeight + 10, config.sideContentWidth, config.bottomHighlightHeight)
    .fillColor(config[style].highlightColour2)
    .fill();
    doc.fillColor(config[style].textColour);

    doc.y += config.topHighlightHeight + 10 + config.margin / 2;
    doc.font('Times-Italic');
    doc.fontSize(16);
    doc.text(content.heading3, doc.x + config.margin / 4, doc.y);
    doc.font(config.font)
    .moveDown(1)
    .fontSize(14)
    .text(content.heading4);
    doc.moveDown(0.5);
    doc.fontSize(12)
    .text(content.p4)
    .text(content.p5)
    .text(content.p6)
    .moveDown(1)
    .fontSize(14)
    .text(content.heading5)
    .moveDown(0.5)
    .fontSize(12)
    .text(content.p7)
    .moveDown(1)
    .fontSize(14)
    .text(content.heading6)
    .moveDown(0.5)
    .fontSize(12)
    .text(content.splitEmail.p1)
    .text(content.splitEmail.p2);

    // main section
    doc.x = retreivePosition().x;
    doc.y = retreivePosition().y;
    doc.moveDown(0.25);
    doc.fontSize(18)
    .fillColor(config[style].hightlightTextColour)
    .text(content.splitHeading1.span, config.mainCvContentX, doc.y, {continued: true})
    .fillColor(config[style].textColour)
    .text(content.splitHeading1.content2);
    doc.moveDown(0.75);
    doc.fontSize(16)
    .text(content.heading2, config.mainCvContentX, doc.y);
    doc.fontSize(11)
    .moveDown()
    .text(content.p1, config.mainCvContentX, doc.y, {width: config.mainContentWidth})
    .moveDown()
    .text(content.p2, config.mainCvContentX, doc.y, {width: config.mainContentWidth})
    .moveDown()
    .text(content.p3, config.mainCvContentX, doc.y, {width: config.mainContentWidth});

    // Core Skills
    doc.moveDown(1.5);
    doc.fontSize(16)
    .text(content.heading7, config.mainCvContentX, doc.y);
    doc.moveDown(0.5);
    doc.fontSize(11)
    .fillColor(config[style].hightlightTextColour)
    .text(content.splitP1.span, config.mainCvContentX, doc.y, {continued: true})
    .fillColor(config[style].textColour)
    .text(content.splitP1.content2)
    .moveDown(0.15)
    .fillColor(config[style].hightlightTextColour)
    .text(content.splitP2.span, config.mainCvContentX, doc.y, {continued: true})
    .fillColor(config[style].textColour)
    .text(content.splitP2.content2)
    .moveDown(0.15)
    .fillColor(config[style].hightlightTextColour)
    .text(content.splitP3.span, config.mainCvContentX, doc.y, {continued: true})
    .fillColor(config[style].textColour)
    .text(content.splitP3.content2)
    .moveDown(0.15)
    .fillColor(config[style].hightlightTextColour)
    .text(content.splitP4.span, config.mainCvContentX, doc.y, {continued: true})
    .fillColor(config[style].textColour)
    .text(content.splitP4.content2)
    .moveDown(0.15)
    .fillColor(config[style].hightlightTextColour)
    .text(content.splitP5.span, config.mainCvContentX, doc.y, {continued: true})
    .fillColor(config[style].textColour)
    .text(content.splitP5.content2)
    .moveDown(0.15);

    // Edumacation
    doc.moveDown(1.5);
    doc.fontSize(16)
    .text(content.heading8, config.mainCvContentX, doc.y);
    doc.fontSize(14)
    .moveDown(0.25)
    .fillColor(config[style].lightTextColour)
    .text(content.heading9, config.mainCvContentX, doc.y)
    .fillColor(config[style].textColour);
    doc.moveDown(0.5)
    .fontSize(11)
    .text(content.p9, config.mainCvContentX, doc.y)
    .text(content.p10, config.mainCvContentX, doc.y)
    .text(content.p11, config.mainCvContentX, doc.y)
    .text(content.p12, config.mainCvContentX, doc.y);

    // Work history
    doc.moveDown(1.5);
    doc.fontSize(16)
    .text(content.heading10, config.mainCvContentX, doc.y);
    doc.fontSize(14)
    .moveDown(0.25)
    .fillColor(config[style].lightTextColour)
    .text(content.heading11, config.mainCvContentX, doc.y)
    .fillColor(config[style].textColour);
    doc.moveDown(0.5);
    doc.fontSize(11)
    .text(content.p13, config.mainCvContentX, doc.y);
    doc.moveDown();
    doc.list([content.list1.item3], {bulletRadius: 2, textIndent: 20, lineGap: 1, width: config.mainContentWidth});
    doc.moveDown();

    // PAGE 2
    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height)
    .fillColor(config[style].textColour)
    .fill();
    doc.rect(config.borderWidth, config.borderWidth, doc.page.width - config.borderWidth * 2, doc.page.height - config.borderWidth * 2)
    .fillColor(config[style].backGroundColour)
    .fill()
    .moveTo(0, 0)
    .fillColor(config[style].textColour);
    functions.heading(doc, content.heading1, config.h1Size);
    functions.hr(doc, doc.page.width - config.margin * 2);
    storePosition(doc.x, doc.y);

    // top left box
    doc.rect(doc.x, doc.y, config.sideContentWidth, config.topHighlightHeight)
    .fillColor(config[style].highlightColour1)
    .fill();
    doc.image(path.join(__dirname, '../images/laptop.png'), doc.x + 25, doc.y + 25, {width: 125, height: 125});

    // bottom left box
    doc.rect(doc.x, doc.y + config.topHighlightHeight + 10, config.sideContentWidth, config.bottomHighlightHeight)
    .fillColor(config[style].highlightColour2)
    .fill();
    doc.fillColor(config[style].textColour);
    doc.y += config.topHighlightHeight + 10 + config.margin / 2;
    doc.font('Times-Italic');
    doc.fontSize(16);
    doc.text(content.heading3, doc.x + config.margin / 4, doc.y);
    doc.font(config.font)
    .moveDown(1)
    .fontSize(14)
    .text(content.heading4);
    doc.moveDown(0.5);
    doc.fontSize(12)
    .text(content.p4)
    .text(content.p5)
    .text(content.p6)
    .moveDown(1)
    .fontSize(14)
    .text(content.heading5)
    .moveDown(0.5)
    .fontSize(12)
    .text(content.p7)
    .moveDown(1)
    .fontSize(14)
    .text(content.heading6)
    .moveDown(0.5)
    .fontSize(12)
    .text(content.splitEmail.p1)
    .text(content.splitEmail.p2);

    // main section
    doc.x = retreivePosition().x;
    doc.y = retreivePosition().y;
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text('', config.mainCvContentX, doc.y);
    doc.list([content.list1.item2], {bulletRadius: 2, textIndent: 20, lineGap: 1});
    doc.moveDown(0.5);
    doc.list([content.list1.item1], {bulletRadius: 2, textIndent: 20, lineGap: 1});

    // event particiaption
    doc.moveDown(1.5);
    doc.fontSize(16)
    .text(content.heading12, config.mainCvContentX, doc.y);
    doc.fontSize(14)
    .moveDown(0.25)
    .fillColor(config[style].lightTextColour)
    .text(content.heading13, config.mainCvContentX, doc.y)
    .fillColor(config[style].textColour);
    doc.moveDown(0.5);
    doc.fontSize(11)
    .text(content.p14, config.mainCvContentX, doc.y);
    doc.moveDown();

    doc.fontSize(14)
    .moveDown(0.25)
    .fillColor(config[style].lightTextColour)
    .text(content.heading14, config.mainCvContentX, doc.y)
    .fillColor(config[style].textColour);
    doc.moveDown(0.5);
    doc.fontSize(11)
    .text(content.p15, config.mainCvContentX, doc.y);

    doc.moveDown(1.5);
    doc.fontSize(16)
    .text(content.heading15, config.mainCvContentX, doc.y);
    doc.moveDown(0.5);
    doc.fontSize(11)
    .text(content.p16, config.mainCvContentX, doc.y);
    doc.moveDown();

    // stream endpoint
    doc.flushPages();
    doc.end();


    function storePosition(x, y) {
        position.x = x;
        position.y = y;
    }

    function retreivePosition() {
        return position;
    }
};
