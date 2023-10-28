# @zemble/migrations

## Install

```bash
bun install @zemble/migrations
```

## Create your first migration
  
```bash
bunx create-migration <name> [template]
```

The migration should export an up and optionally a down function

## Add plugin to your app

```ts
import { createApp } from '@zemble/app';
import Migrations from '@zemble/migrations';
import MongoAdapter from '@zemble/mongodb/helpers/migration-adapter';

const app = createApp({
  plugins: [
    Migrations.configure({
      createAdapter: () => new MongoAdapter(mongoUrl),
    })
  ],
});
```

The provider could be for any type of database, mongodb is just an example.