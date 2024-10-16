import util, { InspectOptions } from 'util';

/**
 * Reveal hidden properties of an object used in console.log().
 * @example
 * // Result in console:
 * // from
 * { a: [Array] };
 * // to
 * { a: [{ aa: 1, ab: 2 }] };
 */
export const serializeObject = <T>(obj: T, opts?: InspectOptions) => {
  return util.inspect(obj, { showHidden: false, depth: null, colors: true, ...opts });
};
