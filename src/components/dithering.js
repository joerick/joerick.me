// Atkinson thanks to https://github.com/ticky/canvas-dither/blob/master/canvas-image-worker.js
// Flickr's Atkinson was easy to understand but melted with some fps https://github.com/flickr/FlickrDithr/blob/master/dither.js
// Bayer parsed from http://en.wikipedia.org/wiki/Ordered_dithering
// adapted from https://raw.githubusercontent.com/meemoo/meemooapp/main/src/nodes/image-monochrome-worker.js

var bayerThresholdMap = [
    [15, 135, 45, 165],
    [195, 75, 225, 105],
    [60, 180, 30, 150],
    [240, 120, 210, 90]
];

var lumR = [];
var lumG = [];
var lumB = [];
for (var i = 0; i < 256; i++) {
    lumR[i] = i * 0.299;
    lumG[i] = i * 0.587;
    lumB[i] = i * 0.114;
}

export function colorDither(imageData, threshold, type, ditheringLevels, exposureAdjust, contrastAdjust) {

    var imageDataLength = imageData.data.length;
    ditheringLevels = ditheringLevels || 2;
    exposureAdjust = exposureAdjust || 1;
    contrastAdjust = contrastAdjust || 1;

    var w = imageData.width;
    var newPixel, err;

    for (var currentPixel = 0; currentPixel <= imageDataLength; currentPixel += 1) {
        imageData.data[currentPixel] = ((imageData.data[currentPixel] - 127) * contrastAdjust + 127) * exposureAdjust;

        if (type === "none") {
            // No dithering
            imageData.data[currentPixel] = imageData.data[currentPixel] < threshold ? 0 : 255;
        } else if (type === "bayer") {
            // 4x4 Bayer ordered dithering algorithm
            var x = currentPixel / 4 % w;
            var y = Math.floor(currentPixel / 4 / w);
            var map = Math.floor((imageData.data[currentPixel] + bayerThresholdMap[x % 4][y % 4]) / 2);
            imageData.data[currentPixel] = (map < threshold) ? 0 : 255;
        } else if (type === "floydsteinberg") {
            // Floyd–Steinberg dithering algorithm
            newPixel = Math.floor(imageData.data[currentPixel] / 255 * ditheringLevels) / ditheringLevels * 255;
            err = Math.floor((imageData.data[currentPixel] - newPixel) / 16);
            imageData.data[currentPixel] = newPixel;

            imageData.data[currentPixel + 4] += err * 7;
            imageData.data[currentPixel + 4 * w - 4] += err * 3;
            imageData.data[currentPixel + 4 * w] += err * 5;
            imageData.data[currentPixel + 4 * w + 4] += err * 1;
        } else if (type === "atkinson") {
            // Bill Atkinson's dithering algorithm
            if (ditheringLevels == 2) {
                newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
            } else if (ditheringLevels == 3) {
                newPixel = imageData.data[currentPixel] < 87 ? 0 : imageData.data[currentPixel] < 172 ? 128 : 255;
            } else {
                newPixel = Math.floor(imageData.data[currentPixel] / 255 * ditheringLevels) / ditheringLevels * 255;
            }

            err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
            imageData.data[currentPixel] = newPixel;

            imageData.data[currentPixel + 4] += err;
            imageData.data[currentPixel + 8] += err;
            imageData.data[currentPixel + 4 * w - 4] += err;
            imageData.data[currentPixel + 4 * w] += err;
            imageData.data[currentPixel + 4 * w + 4] += err;
            imageData.data[currentPixel + 8 * w] += err;
        } else {
            throw new Error('unknown algorithm');
        }
    }

    return imageData;
}

export function colorDitherAtkinson16Bit(imageData, options) {
    const { exposureAdjust = 1, contrastAdjust = 1 } = options;

    var imageDataLength = imageData.data.length;

    var w = imageData.width;
    var newPixel, err;
    const stride = 4

    // from https://en.wikipedia.org/wiki/List_of_software_palettes#Apple_Macintosh_default_16-color_palette
    const palette = [
        { r: 0.000, g: 0.000, b: 0.000 },
        { r: 0.243, g: 0.243, b: 0.243 },
        { r: 0.506, g: 0.506, b: 0.506 },
        { r: 0.761, g: 0.761, b: 0.761 },
        { r: 0.569, g: 0.444, b: 0.207 },
        { r: 0.343, g: 0.155, b: 0.000 },
        { r: 0.000, g: 0.393, b: 0.028 },
        { r: 0.101, g: 0.730, b: 0.052 },
        { r: 0.001, g: 0.681, b: 0.915 },
        { r: 0.000, g: 0.001, b: 0.835 },
        { r: 0.279, g: 0.000, b: 0.650 },
        { r: 0.942, g: 0.011, b: 0.522 },
        { r: 0.866, g: 0.003, b: 0.007 },
        { r: 1.000, g: 0.394, b: 0.000 },
        { r: 0.990, g: 0.959, b: 0.014 },
        { r: 1.000, g: 1.000, b: 1.000 },
    ]
    const palette255 = palette.map(({ r, g, b }) => (
        { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
    ))

    const closestPaletteColor = (color) => {
        const colorDistance = (c1, c2) => Math.sqrt(
            Math.pow(c1.r - c2.r, 2)*0.8
            + Math.pow(c1.g - c2.g, 2)*1.9
            + Math.pow(c1.b - c2.b, 2)*0.5
        );
        // const colorDistance = (c1, c2) => Math.sqrt(
        //     Math.abs(c1.r - c2.r)
        //     + Math.abs(c1.g - c2.g)*1.3
        //     + Math.abs(c1.b - c2.b)*0.7
        // );
        let minDistance = Infinity;
        let closestColor = null;
        for (const paletteColor of palette255) {
            const distance = colorDistance(color, paletteColor);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = paletteColor;
            }
        }
        return closestColor;
    }

    for (var currentPixelI = 0; currentPixelI < imageDataLength; currentPixelI += stride) {
        // image adjustments
        imageData.data[currentPixelI + 0] = ((imageData.data[currentPixelI + 0] - 127) * contrastAdjust + 127) * exposureAdjust;
        imageData.data[currentPixelI + 1] = ((imageData.data[currentPixelI + 1] - 127) * contrastAdjust + 127) * exposureAdjust;
        imageData.data[currentPixelI + 2] = ((imageData.data[currentPixelI + 2] - 127) * contrastAdjust + 127) * exposureAdjust;

        let r = imageData.data[currentPixelI + 0];
        let g = imageData.data[currentPixelI + 1];
        let b = imageData.data[currentPixelI + 2];
        let a = imageData.data[currentPixelI + 3];
        const color = { r, g, b };

        const newPixel = closestPaletteColor(color);
        const newPixelArray = [newPixel.r, newPixel.g, newPixel.b, a];
        for (let i = 0; i < 4; i++) {
            const componentI = currentPixelI + i;
            const err = Math.floor((imageData.data[componentI] - newPixelArray[i]) / 8);

            imageData.data[componentI] = newPixelArray[i];

            imageData.data[componentI + 4] += err;
            imageData.data[componentI + 8] += err;
            imageData.data[componentI + 4 * w - 4] += err;
            imageData.data[componentI + 4 * w] += err;
            imageData.data[componentI + 4 * w + 4] += err;
            imageData.data[componentI + 8 * w] += err;
        }
    }

    return imageData;
}
