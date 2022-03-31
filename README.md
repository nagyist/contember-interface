# Contember Admin

## Contributing
If you wish to send a pull request, be sure to first consult the maintainers by creating an issue. We typically react
very quickly and are happy to provide any guidance.

## Local setup
1. Install [pnpm](https://pnpm.io/) if you haven't already. `npm -g install pnpm`
2. Run `pnpm install`
3. `cp docker-compose.override.dev-admin.yaml docker-compose.override.yaml`
4. Run `docker-compose up`
5. Run `docker-compose run contember-cli migrations:execute admin-sandbox`

## UI development
Run `pnpm run storybook`. Add/edit stories in `packages/ui/stories`.
