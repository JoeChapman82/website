module.exports =  {
    pageSize: [595.28, 841.89], // A4 in pdf points
    font: 'Helvetica',
    fontBold: 'Helvetica-Bold',
    h1Size: 20,
    h3Size: 18,
    textSize: 12,
    margin: 32,
    mainContentWidth: (595.28 - (2 * 32)) * 0.63,
    sideContentWidth: (595.28 - (2 * 32)) * 0.33,
    mainContentX: 32,
    sideContentX: ((595.28 - (2 * 32)) * 0.66) + 62,
    mainCvContentX: ((595.28 - (2 * 32)) * 0.34) + 47,
    borderWidth: 2,
    indent: 38,
    highlightColour: '#DEDBDE',
    topHighlightHeight: 180,
    bottomHighlightHeight: 550,
    options: {
        size: 'A4',
        margins: {
            top: 32,
            bottom: 32,
            left: 32,
            right: 32
        },
        info: {
            Title: 'Joe Chapman - CV',
            Author: 'Joesplayhouse'
        },
        bufferPages: true,
        fontSize: 12,
        font: 'Helvetica'
    },
    dark: {
        backGroundColour: '#212121',
        textColour: '#DEDEDE',
        lightTextColour: '#BCBCBC',
        hightlightTextColour: '#4BA6B6',
        highlightColour1: 'grey',
        highlightColour2: '#7C1B10'
    },
    light: {
        backGroundColour: '#FAFAFA',
        textColour: '#0B0B0B',
        lightTextColour: '#636363',
        hightlightTextColour: '#0F73BB',
        highlightColour1: 'grey',
        highlightColour2: '#DBDCDA'
    }
};
