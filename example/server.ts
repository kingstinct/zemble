import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as fs from 'node:fs'
import * as path from 'node:path'
import readRoutes from './utils/readRoutes'
import readDir from './utils/readDir'
import createPluginSchema from './utils/createPluginSchema'
import { mergeSchemas } from '@graphql-tools/schema'
import handleYoga from './utils/handleYoga'

const app = new Hono()

app.get('/', (c) => c.text('Hello ReAdapt!'))

const pluginsPath = path.join(process.cwd(), 'plugins');

const start = async () => {
  const plugins = readDir(pluginsPath)
  let graphQLSchemas = []
  await plugins.reduce(async (prev, pluginName) => {
    await prev;
    const routePath = path.join(process.cwd(), 'plugins/' + pluginName + '/routes');
    const graphqlPath = path.join(process.cwd(), 'plugins/' + pluginName + '/graphql');

    const hasGraphQL = fs.existsSync(graphqlPath)

    if(hasGraphQL) {
      graphQLSchemas = [...graphQLSchemas, await createPluginSchema(graphqlPath)]
    }

    const hasRoutes = fs.existsSync(routePath)

    if(hasRoutes){
      const filesWithContent = await readRoutes(routePath)
  
      Object.keys(filesWithContent).forEach((filename) => {
        app.use(filename, filesWithContent[filename])
      })
    }
  }, Promise.resolve(undefined))
  
  
 
  const mergedSchema = mergeSchemas({
    schemas: graphQLSchemas,
  })

  app.use('/graphql', handleYoga(mergedSchema))

  serve(app, (info) => console.log(info))
}

start()