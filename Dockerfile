FROM node:22-slim AS build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get -y install jq zip
COPY . /eventuate
WORKDIR /eventuate
RUN pnpm i
RUN pnpm t
RUN pnpm build
RUN pnpm web-ext:lint

FROM scratch AS export-stage
COPY --from=build-stage /eventuate/chromium/ /chromium
COPY --from=build-stage /eventuate/web-ext-artifacts/ /web-ext-artifacts
COPY --from=build-stage /eventuate/*.zip /
