import { map } from "./util";
export default class Vector {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.toString = () => {
            return this.x + ' ' + this.y;
        };
    }
    /**
     * Creates a new vector.
     * @method create
     * @param {number} x
     * @param {number} y
     * @return {vector} A new vector
     */
    static create(x, y) {
        return { x: x || 0, y: y || 0 };
    }
    /**
     * Returns a new vector with `x` and `y` copied from the given `vector`.
     * @method clone
     * @param {vector} vector
     * @return {vector} A new cloned vector
     */
    static clone(vector) {
        return { x: vector.x, y: vector.y };
    }
    ;
    /**
     * Returns the cross-product of three vectors.
     * @method cross3
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @param {vector} vectorC
     * @return {number} The cross product of the three vectors
     */
    static cross3(vectorA, vectorB, vectorC) {
        return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
    }
    ;
    /**
     * Adds the two vectors.
     * @method add
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @param {vector} [output]
     * @return {vector} A new vector of vectorA and vectorB added
     */
    static add(vectorA, vectorB, output) {
        if (!output)
            output = Vector.create();
        output.x = vectorA.x + vectorB.x;
        output.y = vectorA.y + vectorB.y;
        return output;
    }
    ;
    /**
     * Returns the angle in radians between the two vectors relative to the x-axis.
     * @method angle
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @return {number} The angle in radians
     */
    static angle(vectorA, vectorB) {
        return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
    }
    ;
    /**
     * Returns the cross-product of two vectors.
     * @method cross
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @return {number} The cross product of the two vectors
     */
    static cross(vectorA, vectorB) {
        return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x);
    }
    ;
    /**
     * Divides a vector and a scalar.
     * @method div
     * @param {vector} vector
     * @param {number} scalar
     * @return {vector} A new vector divided by scalar
     */
    static div(vector, scalar) {
        return { x: vector.x / scalar, y: vector.y / scalar };
    }
    ;
    /**
     * Returns the dot-product of two vectors.
     * @method dot
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @return {number} The dot product of the two vectors
     */
    static dot(vectorA, vectorB) {
        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
    }
    ;
    /**
     * Returns the magnitude (length) of a vector.
     * @method magnitude
     * @param {vector} vector
     * @return {number} The magnitude of the vector
     */
    static magnitude(vector) {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    }
    ;
    /**
     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
     * @method magnitudeSquared
     * @param {vector} vector
     * @return {number} The squared magnitude of the vector
     */
    static magnitudeSquared(vector) {
        return (vector.x * vector.x) + (vector.y * vector.y);
    }
    ;
    /**
     * Multiplies a vector and a scalar.
     * @method mult
     * @param {vector} vector
     * @param {number} scalar
     * @return {vector} A new vector multiplied by scalar
     */
    static mult(vector, scalar) {
        return { x: vector.x * scalar, y: vector.y * scalar };
    }
    ;
    /**
     * Negates both components of a vector such that it points in the opposite direction.
     * @method neg
     * @param {vector} vector
     * @return {vector} The negated vector
     */
    static neg(vector) {
        return { x: -vector.x, y: -vector.y };
    }
    ;
    /**
     * Normalises a vector (such that its magnitude is `1`).
     * @method normalise
     * @param {vector} vector
     * @return {vector} A new vector normalised
     */
    static normalise(vector) {
        var magnitude = Vector.magnitude(vector);
        if (magnitude === 0)
            return { x: 0, y: 0 };
        return { x: vector.x / magnitude, y: vector.y / magnitude };
    }
    ;
    /**
     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
     * @method perp
     * @param {vector} vector
     * @param {bool} [negate=false]
     * @return {vector} The perpendicular vector
     */
    static perp(vector, negate) {
        const sign = negate === true ? -1 : 1;
        return { x: sign * -vector.y, y: sign * vector.x };
    }
    ;
    /**
     * Rotates the vector about (0, 0) by specified angle.
     * @method rotate
     * @param {vector} vector
     * @param {number} angle
     * @return {vector} A new vector rotated about (0, 0)
     */
    static rotate(vector, angle, output) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        if (!output)
            output = Vector.create();
        var x = vector.x * cos - vector.y * sin;
        output.y = vector.x * sin + vector.y * cos;
        output.x = x;
        return output;
    }
    ;
    /**
     * Rotates the vector about a specified point by specified angle.
     * @method rotateAbout
     * @param {vector} vector
     * @param {number} angle
     * @param {vector} point
     * @param {vector} [output]
     * @return {vector} A new vector rotated about the point
     */
    static rotateAbout(vector, angle, point, output) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        if (!output)
            output = Vector.create();
        var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
        output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
        output.x = x;
        return output;
    }
    ;
    /**
     * Subtracts the two vectors.
     * @method sub
     * @param {vector} vectorA
     * @param {vector} vectorB
     * @param {vector} [output]
     * @return {vector} A new vector of vectorA and vectorB subtracted
     */
    static sub(vectorA, vectorB, output) {
        if (!output)
            output = Vector.create();
        output.x = vectorA.x - vectorB.x;
        output.y = vectorA.y - vectorB.y;
        return output;
    }
    ;
    static multEach(vectorA, vectorB) {
        return {
            x: vectorA.x * vectorB.x,
            y: vectorA.y * vectorB.y
        };
    }
    static interp(vectorA, vectorB, value) {
        return {
            x: vectorB.x * value + vectorA.x * (1 - value),
            y: vectorB.y * value + vectorA.y * (1 - value),
        };
    }
    static interpKeyframes(keyframes, value) {
        if (keyframes.length == 0) {
            throw new Error('keyframes cannot be empty');
        }
        keyframes.sort((a, b) => (a.p - b.p));
        let result = keyframes[0];
        for (let i = 1; i < keyframes.length; i++) {
            const frame = keyframes[i];
            const prevFrame = keyframes[i - 1];
            result = Vector.interp(result, frame, map(value, { from: [prevFrame.p, frame.p], clamp: true }));
        }
        return result;
    }
    static get zero() {
        return new Vector();
    }
    /**
     * Finds the vector of the closest distance from the line starting at line1
     * and ending at line2.
     */
    static shortestVectorToLine(point, line1, line2) {
        const xDelta = line2.x - line1.x;
        const yDelta = line2.y - line1.y;
        const u = ((point.x - line1.x) * xDelta + (point.y - line1.y) * yDelta) / (xDelta * xDelta + yDelta * yDelta);
        let closestPointOnLine;
        if (u < 0) {
            closestPointOnLine = line1;
        }
        else if (u > 1) {
            closestPointOnLine = line2;
        }
        else {
            closestPointOnLine = { x: line1.x + u * xDelta, y: line1.y + u * yDelta };
        }
        return Vector.sub(point, closestPointOnLine);
    }
}
