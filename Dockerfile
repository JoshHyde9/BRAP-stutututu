FROM nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Install Turbo globally
RUN bun install -g turbo

# Copy package.json files and workspace configs
COPY package.json bun.lock turbo.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/auth/package.json ./packages/auth/
COPY packages/api/package.json ./packages/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint/package.json ./packages/eslint/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/prettier/package.json ./packages/prettier/

# Install dependencies
RUN bun install

# Copy the rest of the code
COPY . .

# Generate Prisma Client
RUN cd packages/db && bunx prisma generate

# Build all packages
RUN turbo build

# Production stage for the server
FROM base AS server
CMD ["bun", "run", "--cwd", "apps/server", "start"]

# Production stage for the web app
FROM base AS web
CMD ["bun", "run", "--cwd", "apps/web", "start"]