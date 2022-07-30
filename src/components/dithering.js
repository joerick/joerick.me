// Atkinson thanks to https://github.com/ticky/canvas-dither/blob/master/canvas-image-worker.js
// Flickr's Atkinson was easy to understand but melted with some fps https://github.com/flickr/FlickrDithr/blob/master/dither.js
// Bayer parsed from http://en.wikipedia.org/wiki/Ordered_dithering
// adapted from https://raw.githubusercontent.com/meemoo/meemooapp/main/src/nodes/image-monochrome-worker.js

var bayerThresholdMap = [
  [  15, 135,  45, 165 ],
  [ 195,  75, 225, 105 ],
  [  60, 180,  30, 150 ],
  [ 240, 120, 210,  90 ]
];

var lumR = [];
var lumG = [];
var lumB = [];
for (var i=0; i<256; i++) {
  lumR[i] = i*0.299;
  lumG[i] = i*0.587;
  lumB[i] = i*0.114;
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
      var x = currentPixel/4 % w;
      var y = Math.floor(currentPixel/4 / w);
      var map = Math.floor( (imageData.data[currentPixel] + bayerThresholdMap[x%4][y%4]) / 2 );
      imageData.data[currentPixel] = (map < threshold) ? 0 : 255;
    } else if (type === "floydsteinberg") {
      // Floyd–Steinberg dithering algorithm
      newPixel = Math.floor(imageData.data[currentPixel] / 255 * ditheringLevels) / ditheringLevels * 255;
      err = Math.floor((imageData.data[currentPixel] - newPixel) / 16);
      imageData.data[currentPixel] = newPixel;

      imageData.data[currentPixel       + 4 ] += err*7;
      imageData.data[currentPixel + 4*w - 4 ] += err*3;
      imageData.data[currentPixel + 4*w     ] += err*5;
      imageData.data[currentPixel + 4*w + 4 ] += err*1;
    } else if (type === "atkinson") {
      // Bill Atkinson's dithering algorithm
      if (ditheringLevels == 2) {
        newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
      } else if (ditheringLevels == 3 ){
        newPixel = imageData.data[currentPixel] < 87 ? 0 : imageData.data[currentPixel] < 172 ? 128 : 255;
      } else {
          newPixel = Math.floor(imageData.data[currentPixel] / 255 * ditheringLevels) / ditheringLevels * 255;
      }

      err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
      imageData.data[currentPixel] = newPixel;

      imageData.data[currentPixel       + 4 ] += err;
      imageData.data[currentPixel       + 8 ] += err;
      imageData.data[currentPixel + 4*w - 4 ] += err;
      imageData.data[currentPixel + 4*w     ] += err;
      imageData.data[currentPixel + 4*w + 4 ] += err;
      imageData.data[currentPixel + 8*w     ] += err;
    } else {
        throw new Error('unknown algorithm');
    }
  }

  return imageData;
}
