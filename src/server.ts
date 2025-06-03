import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then((server) => {
    console.log(`🚀 Server listening on ${env.PORT}`)
  })
