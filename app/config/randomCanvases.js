const randomCanvas = [
    {
        canvasName: 'concentric-circles-xor',
        canvasAmount: 1,
        controls: {
            backgroundColour: {
                type: 'colour',
                label: 'background colour'
            },
            foregroundColour: {
                type: 'colour',
                label: 'foreground colour'
            },
            repetitions: {
                type: 'range',
                label: 'repetitions',
                min: 0,
                max: 4
            }
        }
    },
    {
        canvasName: 'expanding-rotating-circles',
        canvasAmount: 1,
        controls: {
            rotationSpeed: {
                type: 'range',
                label: 'rotation speed',
                min: 0,
                max: 25,
            },
            particleAmount: {
                type: 'range',
                label: 'particle amount',
                min: 10,
                max: 100,
                step: 2,
            },
            variance: {
                type: 'range',
                label: 'variance',
                min: 10,
                max: 150
            },
            expansionSpeed: {
                type: 'range',
                label: 'expansion speed',
                min: 0,
                max: 10
            }
        },


    }
];

module.exports = randomCanvas;
