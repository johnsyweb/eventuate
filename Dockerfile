FROM debian:bookworm-slim AS build-stage
RUN apt-get update && apt-get -y install jq zip curl ca-certificates git
RUN curl https://mise.run | sh
ENV PATH="/root/.local/bin:${PATH}"
COPY . /eventuate
WORKDIR /eventuate
RUN mise trust
RUN mise install
RUN mise run package

FROM scratch AS export-stage
COPY --from=build-stage /eventuate/chromium/ /chromium
COPY --from=build-stage /eventuate/web-ext-artifacts/ /web-ext-artifacts
COPY --from=build-stage /eventuate/*.zip /
COPY --from=build-stage /eventuate/docs/*.js /
COPY --from=build-stage /eventuate/docs/bookmarklet.* /
