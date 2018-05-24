/* eslint no-unused-vars: 0 */
if (!Object.entries) {
  Object.entries = function(obj) {
    let ownProps = Object.keys(obj);
    let i = ownProps.length;
    let resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
}
/**
 * Checks to See if Object contains
 *
 * @param {...any} obj object to see
 * @returns {Boolean} isNested
 */
function checkNested(obj /*, level1, level2, ... levelN */) {
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
var recorder;
var canvasObject;
var lastFrame = 60;

// For Recording

/**
 * Adds A frame to the recording and saves if at end
 *
 */
function recordFrame() {
  if (frameCount <= lastFrame) {
    recorder.capture(canvasObject);
    if (frameCount === lastFrame) {
      recorder.stop();
      recorder.save();
    }
  }
}
/**
 * Set's up Recording
 *
 */
function recordSetup() {
  recorder = new CCapture({
    format: "webm",
    framerate: 60
  });
  canvasObject = document.getElementById("defaultCanvas0");
  recorder.start();
}
function sqr(x) {
  return x * x;
}
function dist2(v, w) {
  return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}
/**
 * Returns Distance betweeen a point and a line
 *
 * @param {[Number,Number]} origin Point
 * @param {[Number,Number]} first line vertice
 * @param {[Number,Number]} second line vertice
 * @returns {Number} Distance
 */
function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}
/**
 *
 *
 * @param {[Number, Number][]} poly
 * @returns Number
 */
function getMinDist(poly) {
  let c = d3.polygonCentroid(poly);
  let r = d3.range(poly.length).map(i => {
    let thisP = poly[i];
    let nextP = poly[(i + 1) % poly.length];
    return distToSegment(c, thisP, nextP);
  });
  return Math.min(...r);
}
