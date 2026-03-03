FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./app.ts ./app.ts
COPY ./index.html ./index.html
COPY ./vite.config.ts ./vite.config.ts
COPY ./tsconfig.json ./tsconfig.json
COPY ./drizzle.config.ts ./drizzle.config.ts
COPY ./src ./src
COPY ./server ./server

ENV NODE_ENV=production

RUN bun run build

FROM oven/bun AS release

WORKDIR /app

# Install production dependencies only
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install --production

COPY --from=build /app/dist dist
COPY --from=build /app/server server
COPY --from=build /app/app.ts app.ts
COPY --from=build /app/tsconfig.json tsconfig.json
COPY --from=build /app/drizzle.config.ts drizzle.config.ts

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "bun run db:migrate && bun run app.ts"]
