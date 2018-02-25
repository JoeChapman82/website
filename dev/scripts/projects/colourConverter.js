(function() {
    "use strict";

    var hexResultElement = document.getElementById('hexResult');
    var rgbResultElement = document.getElementById('rgbResult');
    var rgbaResultElement = document.getElementById('rgbaResult');
    var nameResultElement = document.getElementById('nameResult');
    var hslResultElement = document.getElementById('hslResult');
    var displayResultElement = document.getElementById('displayResult');

    document.addEventListener('keydown', shouldConvert);
    document.getElementById('convertColour').addEventListener('click', convertColour);

    function shouldConvert(e) {
        if(e.keyCode === 13) {
            document.getElementById('convertColour').click();
        }
    }

    function convertColour() {
        document.getElementById('invalidColourMessage').classList.add('colour-converter-hidden');
        var rgb;
        var rgba;
        var hex;
        var name;
        var hsl;
        var colourToConvert = document.getElementById('colourConverterInput').value;
        var colourType = identifyColourType(colourToConvert);
        switch(colourType) {
            case 'invalid': {
                document.getElementById('invalidColourMessage').classList.remove('colour-converter-hidden');
                rgb = {r: 0, g: 0, b: 0};
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                rgba = {r: 0, g: 0, b: 0, a: 0};
                hex = '#000000';
                name = 'no name';
                break;
            }
            case 'hex': {
                rgb = hexToRgb(colourToConvert);
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                hex = colourToConvert.charAt(0) === '#' ? colourToConvert.toUpperCase() : '#' + colourToConvert.toUpperCase();
                rgba = {r: rgb.r, g: rgb.g, b: rgb.b, a: 1};
                name = findColourName(expandHexTriplets(colourToConvert));
                break;
            }
            case 'rgb': {
                rgb = getRgbComponents(colourToConvert);
                if(!rgb) {
                    document.getElementById('invalidColourMessage').classList.remove('colour-converter-hidden');
                    return;
                }
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                rgba = {r: rgb.r, g: rgb.g, b: rgb.b, a: 1};
                name = findColourName(hex);
                break;
            }
            case 'rgba': {
                rgba = getRgbaComponents(colourToConvert);
                if(!rgba) {
                    document.getElementById('invalidColourMessage').classList.remove('colour-converter-hidden');
                    return;
                }
                rgb = {r: rgba.r, g: rgba.g, b: rgba.b};
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                hex = rgbToHex(rgb.r, rgb.g, rgb.b);
                name = findColourName(hex);
                break;
            }
            case 'name': {
                hex = namedColourValues[lowerCasedColourNames.indexOf(colourToConvert.toLowerCase())];
                rgb = hexToRgb(hex);
                hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                rgba = {r: rgb.r, g: rgb.g, b: rgb.b, a: 1};
                name = findColourName(hex);
            }
        }
        if(!isValidRgbComponent(rgb.r) || !isValidRgbComponent(rgb.g) || !isValidRgbComponent(rgb.b)) {
            document.getElementById('invalidColourMessage').classList.remove('colour-converter-hidden');
            return;
        }
        hexResultElement.innerText = hex;
        rgbResultElement.innerText = createRgbString(rgb.r, rgb.g, rgb.b);
        rgbaResultElement.innerText = createRgbaString(rgba.r, rgba.g, rgba.b, rgba.a);
        hslResultElement.innerText = createHslString(hsl.h, hsl.s, hsl.l);
        nameResultElement.innerText = name;
        displayResultElement.style.backgroundColor = createRgbaString(rgba.r, rgba.g, rgba.b, rgba.a);
    }

    function identifyColourType(value) {
        value = value.trim();
        if(lowerCasedColourNames.indexOf(value.toLowerCase()) !== -1) {
            return 'name';
        } else if(value.indexOf('rgba') > -1) {
            return 'rgba';
        } else if(value.indexOf('rgb') > -1) {
            return 'rgb';
        } else if(isHex(value)) {
            return 'hex';
        } else {
            return 'invalid';
        }
    }

    function hexToRgb(hex) {
        hex = expandHexTriplets(hex);
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function expandHexTriplets(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        return hex;
    }

    function isValidRgbComponent(component) {
        return parseInt(component) >= 0 && parseInt(component) <= 255;
    }

    function getRgbComponents(rgbString) {
        var splitString = rgbString.split(',');
        if(splitString.length < 3) {
            return false;
        }
        var r = rgbString.substring(rgbString.indexOf('(') + 1, rgbString.indexOf(',')).trim();
        var g = splitString[1].trim();
        var b = rgbString.substring(rgbString.lastIndexOf(',') + 1, rgbString.indexOf(')')).trim();
        return {
            r: parseInt(r),
            g: parseInt(g),
            b: parseInt(b)
        };
    }

    function getRgbaComponents(rgbString) {
        var splitString = rgbString.split(',');
        if(splitString.length < 3) {
            return false;
        }
        var r = rgbString.substring(rgbString.indexOf('(') + 1, rgbString.indexOf(',')).trim();
        var g = splitString[1].trim();
        var b = splitString[2].trim();
        var a = rgbString.substring(rgbString.lastIndexOf(',') + 1, rgbString.indexOf(')')).trim();
        return {
            r: parseInt(r),
            g: parseInt(g),
            b: parseInt(b),
            a: parseInt(a)
        };
    }

    function componentToHex(c) {
        var hex = c.toString(16).toUpperCase();
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function rgbToHsl(r, g, b){
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: {
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                }
                case g: {
                    h = (b - r) / d + 2;
                    break;
                }
                case b: {
                    h = (r - g) / d + 4;
                    break;
                }
            }
            h /= 6;
        }
        return {
            h: h * 360,
            s: (s * 100).toFixed(),
            l: (l * 100).toFixed()
        };
    }

    function isHex(value) {
        var possibleHexValues = '0123456789ABCDEFabcdef';
        var isHex = true;
        var valueArray = value.split('');
        if(valueArray.length === 0 ||
          (valueArray[0] === '#' && (valueArray.length !== 4 && value.length !== 7)) ||
          (valueArray[0] !== '#' && (valueArray.length !== 3 && value.length !== 6))) {
            isHex = false;
        }
        valueArray.forEach(function(x) {
            if(possibleHexValues.indexOf(x) === -1 && x !== '#') {
                isHex = false;
            }
        });
        return isHex;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function createRgbString(r, g, b) {
        return 'rgb(' + r +', ' + g + ', ' + b + ')';
    }

    function createRgbaString(r, g, b, a) {
        return 'rgba(' + r +', ' + g + ', ' + b + ', ' + a + ')';
    }

    function createHslString(h, s, l) {
        return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    }

    function findColourName(hex) {
        hex = hex.charAt(0) === '#' ? hex.substring(1).toLowerCase() : hex.toLowerCase();
        var foundColour = 'no name';
        Object.keys(namedColours).forEach(function(key) {
            if(namedColours[key] === hex) {
                foundColour = key;
            }
        });
        return foundColour;
    }

    var namedColours = {
        aliceBlue: "f0f8ff",
        antiqueWhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedAlmond: "ffebcd",
        blue: "0000ff",
        blueViolet: "8a2be2",
        brown: "a52a2a",
        burlyWood: "deb887",
        cadetBlue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerBlue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkBlue: "00008b",
        darkCyan: "008b8b",
        darkGoldenRod: "b8860b",
        darkGray: "a9a9a9",
        darkGreen: "006400",
        darkGrey: "a9a9a9",
        darkKhaki: "bdb76b",
        darkMagenta: "8b008b",
        darkOliveGreen: "556b2f",
        darkOrange: "ff8c00",
        darkOrchid: "9932cc",
        darkRed: "8b0000",
        darkSalmon: "e9967a",
        darkSeaGreen: "8fbc8f",
        darkSlateBlue: "483d8b",
        darkSlateGray: "2f4f4f",
        darkSlateGrey: "2f4f4f",
        darkTurquoise: "00ced1",
        darkViolet: "9400d3",
        deepPink: "ff1493",
        deepSkyBlue: "00bfff",
        dimGray: "696969",
        dimGrey: "696969",
        dodgerBlue: "1e90ff",
        fireBrick: "b22222",
        floralWhite: "fffaf0",
        forestGreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostWhite: "f8f8ff",
        gold: "ffd700",
        goldenRod: "daa520",
        gray: "808080",
        green: "008000",
        greenYellow: "adff2f",
        grey: "808080",
        honeyDew: "f0fff0",
        hotPink: "ff69b4",
        indianRed: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderBlush: "fff0f5",
        lawnGreen: "7cfc00",
        lemonChiffon: "fffacd",
        lightBlue: "add8e6",
        lightCoral: "f08080",
        lightCyan: "e0ffff",
        lightGoldenRodYellow: "fafad2",
        lightGray: "d3d3d3",
        lightGreen: "90ee90",
        lightGrey: "d3d3d3",
        lightPink: "ffb6c1",
        lightSalmon: "ffa07a",
        lightSeaGreen: "20b2aa",
        lightSkyBlue: "87cefa",
        lightSlateGray: "778899",
        lightSlateGrey: "778899",
        lightSteelBlue: "b0c4de",
        lightYellow: "ffffe0",
        lime: "00ff00",
        limeGreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumAquaMarine: "66cdaa",
        mediumBlue: "0000cd",
        mediumOrchid: "ba55d3",
        mediumPurple: "9370db",
        mediumSeaGreen: "3cb371",
        mediumSlateBlue: "7b68ee",
        mediumSpringGreen: "00fa9a",
        mediumTurquoise: "48d1cc",
        mediumVioletRed: "c71585",
        midnightBlue: "191970",
        mintCream: "f5fffa",
        mistyRose: "ffe4e1",
        moccasin: "ffe4b5",
        navajoWhite: "ffdead",
        navy: "000080",
        oldLace: "fdf5e6",
        olive: "808000",
        oliveDrab: "6b8e23",
        orange: "ffa500",
        orangeRed: "ff4500",
        orchid: "da70d6",
        paleGoldenRod: "eee8aa",
        paleGreen: "98fb98",
        paleTurquoise: "afeeee",
        paleVioletRed: "db7093",
        papayaWhip: "ffefd5",
        peachPuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderBlue: "b0e0e6",
        purple: "800080",
        rebeccaPurple: "663399",
        red: "ff0000",
        rosyBrown: "bc8f8f",
        royalBlue: "4169e1",
        saddleBrown: "8b4513",
        salmon: "fa8072",
        sandyBrown: "f4a460",
        seaGreen: "2e8b57",
        seaShell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyBlue: "87ceeb",
        slateBlue: "6a5acd",
        slateGray: "708090",
        slateGrey: "708090",
        snow: "fffafa",
        springGreen: "00ff7f",
        steelBlue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "ffffff",
        whiteSmoke: "f5f5f5",
        yellow: "ffff00",
        yellowGreen: "9acd32"
    };

    var lowerCasedColourNames = [];
    var namedColourValues = [];
    Object.keys(namedColours).forEach(function(colour) {
        lowerCasedColourNames.push(colour.toLowerCase());
        namedColourValues.push(namedColours[colour]);
    });

})();
