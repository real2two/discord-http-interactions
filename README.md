# HTTP interactions template

A little Discord HTTP interactions template I created which uses HyperExpress and Prisma.x

`/interactions` is the HTTP interactions path.

```
prisma
  schema.prisma // Prisma
src
  commands
    // All application commands here (including slash commands, message components, and autocomplete)
  main
    clusters.ts // Clusters the web server
    index.ts // Loads .env and this is the first file ran
    listen.ts // Listens web server
    routes.ts // Loads routes
  types
    types.ts // Types
  util
    commands.ts // Loads, finds and handles commands
    prisma.ts // Initializes Prisma client
tools
  createCommands.js // Creates commands
```