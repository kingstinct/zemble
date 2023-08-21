
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '../config';


export const getToken = (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY)
}

export default getToken