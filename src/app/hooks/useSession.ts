import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';

export const useSession = () => {
  const [cookies, setCookie] = useCookies(['sessionId']);
  const sessionId = cookies.sessionId || uuidv4();

  if (!cookies.sessionId) {
    setCookie('sessionId', sessionId, { path: '/' });
  }

  return { sessionId };
};