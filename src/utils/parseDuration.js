const ApiError = require('./ApiError');

/**
 * Parses a duration string (e.g., "15m", "7d") into an object that moment.js can use.
 * @param {string} durationString The string to parse.
 * @returns {{value: number, unit: string}} An object with the numeric value and the moment.js unit.
 * @throws {ApiError} If the duration string format is invalid.
 */
const parseDuration = (durationString) => {
  if (!durationString || typeof durationString !== 'string') {
    throw new ApiError(500, 'Invalid duration string provided to parser.');
  }

  const unitMap = {
    s: 'seconds',
    m: 'minutes',
    h: 'hours',
    d: 'days',
    w: 'weeks',
    y: 'years',
  };

  const regex = /^(\d+)([smhdwy])$/;
  const match = durationString.match(regex);

  if (!match) {
    throw new ApiError(500, `Invalid duration format in config: "${durationString}". Use a number followed by s, m, h, d, w, or y.`);
  }

  const value = parseInt(match[1], 10);
  const unit = unitMap[match[2]];

  return { value, unit };
};

module.exports = {
  parseDuration,
};
