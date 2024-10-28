import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();

const middleware = cookieParser(process.env.COOKIE_SECRET);

export default middleware;
