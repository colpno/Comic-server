import originalCookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();

const cookieParser = originalCookieParser(process.env.COOKIE_SECRET);

export default cookieParser;
