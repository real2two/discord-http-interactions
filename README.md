# HTTP interactions template

A little Discord HTTP interactions template I created which uses HyperExpress and Prisma.

I could make a TypeScript template too. If anyone wants that, ask me on Discord.

`/interactions` is the HTTP interactions path.

```
prisma
  schema.prisma // Prisma
src
  commands
    // All application commands here (including slash commands, message components, and autocomplete)
  main
    clusters.js // Clusters the web server
    index.js // Loads .env and this is the first file ran
    listen.js // Listens web server
    routes.js // Loads routes
  util
    commands.js // Loads, finds and handles commands
    prisma.js // Initializes Prisma client
tools
  createCommands.js // Creates commands
```

TODO:
- Automatically create commands.
