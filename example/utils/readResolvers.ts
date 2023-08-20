import { readdirSync } from "fs";
import { join } from "path";

export const readResolvers = async (path: string) => {
  try {
    const resolvers = await readdirSync(path).reduce(async (prev, filename) => {
      let route = join(path, filename);
  
      const fileNameWithoutExtension = filename.substring(0, filename.length - 3);
      try {
          const item = await import(route);
          return {...await prev,[fileNameWithoutExtension]: item.default}
      } catch (error) {
          console.log(error.message);
      }
    }, Promise.resolve({}));
  
    return resolvers  
  } catch (error) {
    
    return {}
  }
}

export default readResolvers