import React, { createContext } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import endPoints from '@services/api';
import { data } from 'autoprefixer';

const AuthContext = createContext();

export function ProviderAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return React.useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = React.useState(null);
  const signIn = async (email, password) => {
    try {
      const options = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
      const { data: access_token } = await axios.post(
        endPoints.auth.login,
        { email, password },
        options
      );
      if (access_token) {
        const token = access_token.access_token;
        Cookie.set('token', access_token.access_token, { expires: 5 });
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await axios.get(endPoints.auth.profile);
        if (user) {
          setUser(user);
        }
      }
      return data.response;
    } catch (error) {
      const { response = {} } = error || {};
      return response.data;
    }
  };

  const logout = () => {
    Cookie.remove('token');
    setUser(null);
    delete axios.defaults.headers.Authorization;
    window.location.href = '/login';
  };

  return {
    user,
    signIn,
    logout,
  };
}
