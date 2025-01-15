import rateLimit from 'express-rate-limit';

// api.mandagadex.org limits to 5 requests per second
// https://api.mangadex.org/docs/2-limitations/#general-rate-limit

const rateLimiter = (options?: Parameters<typeof rateLimit>[0]) =>
  rateLimit({
    ...options,
    windowMs: options?.windowMs ?? 1000, // 1 second
    limit: options?.limit ?? 4, // 4 requests per second
  });

export default rateLimiter;
