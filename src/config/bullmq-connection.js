const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 13374,
  password: process.env.REDIS_PASSWORD || undefined,
}

module.exports = connection;
