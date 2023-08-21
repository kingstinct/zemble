import { MiddlewareHandler } from 'hono';
import * as fs from 'node:fs'
import * as path from 'node:path'

export const readRoutes = (dir: string): Promise<Record<string, MiddlewareHandler>> => {
  return fs.readdirSync(dir).reduce(async (prev, filename) => {
    let route = path.join(dir, filename);

    const fileNameWithoutExtension = filename.substring(0, filename.length - 3);
    try {
        const item = await import(route);
        const newRoutes =  {...await prev,[fileNameWithoutExtension]: item.default}

        return newRoutes;
    } catch (error) {
        console.log(error);

        return prev;
    }
  }, Promise.resolve({} as Record<string, MiddlewareHandler>));
}

export default readRoutes