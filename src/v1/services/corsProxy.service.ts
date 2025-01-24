// @ts-expect-error - This is a workaround for the lack of type definitions for the cors-anywhere package.
import { createServer } from 'cors-anywhere';

const corsProxy = createServer({
  originWhitelist: [], // Allow all origins
  requireHeaders: [], // Do not require any headers.
  removeHeaders: ['cookie', 'cookie2', 'referer'], // Do not remove any headers.
});

export default corsProxy;
