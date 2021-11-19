import { useCallback, useState } from 'react';
import UserVO from '@/beans/user/userVO';

/**
 * 存储用户信息,目前不存储在这里，使用全局的InitialState存储
 */
export default function useUserModel() {
  const [userInfo, setUserInfo] = useState<UserVO>({});
  const setUser = useCallback((data: UserVO) => {
    setUserInfo(data);
  }, []);

  return {
    userInfo,
    setUser,
  };
}
