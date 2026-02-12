import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
  .use(
    await staticPlugin({
      prefix: "/",
    })
  )
  .get('/api/hello', () => ({
    message: 'Hello from Elysia 🚀'
  }))
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
