export async function delay(durationMillis) {
    return new Promise(r => window.setTimeout(r, durationMillis));
}
export function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
export class CancellableTask {
    constructor(runFunc) {
        this.isCancelled = false;
        this.cancelPromise = new Promise((resolve, reject) => {
            this.cancelPromiseRejectCallback = reject;
        });
        this.completionPromise = runFunc(this);
        this.completionPromise.catch((error) => {
            if (error.message == 'cancelled') {
                return;
            }
            else {
                console.error(error);
            }
        });
    }
    async waitForCompletion() {
        return this.completionPromise;
    }
    cancel() {
        this.isCancelled = true;
        this.cancelPromiseRejectCallback(new Error('cancelled'));
    }
    async delay(millis) {
        await Promise.race([
            delay(millis),
            this.cancelPromise,
        ]);
        this.throwIfCancelled();
    }
    async nextAnimationFrame() {
        await Promise.race([
            new Promise(r => window.requestAnimationFrame(r)),
            this.cancelPromise,
        ]);
        this.throwIfCancelled();
    }
    throwIfCancelled() {
        if (this.isCancelled) {
            throw new Error('cancelled');
        }
    }
}
export function clamp(value, min, max) {
    if (value === Infinity) {
        console.warn('clamp: value is Infinity, returning `max`', value);
        return max;
    }
    if (value === -Infinity) {
        console.warn('clamp: value is -Infinity, returning `min`', value);
        return min;
    }
    if (!Number.isFinite(value)) {
        console.warn('clamp: value isn\'t finite, returning `min`', value);
        return min;
    }
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
export function map(x, options) {
    const { from = [0, 1], to = [0, 1] } = options;
    const shouldClamp = options.clamp || false;
    let result = (x - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
    if (shouldClamp) {
        result = clamp(result, Math.min(to[0], to[1]), Math.max(to[0], to[1]));
    }
    return result;
}
export function pseudoRandom(seed) {
    // Mulberry32 generator, from https://stackoverflow.com/a/47593316/382749
    return function () {
        var t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
export function loadImage(href) {
    return new Promise((res, rej) => {
        const image = new Image();
        image.onload = () => res(image);
        image.onerror = e => {
            rej(new Error(`Image load failed. ${e}`));
        };
        image.src = href;
    });
}
