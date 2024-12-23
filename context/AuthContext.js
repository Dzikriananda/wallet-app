import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(); //untuk membuat konteks yang memungkinkan data tertentu tersedia untuk seluruh komponen yang ada dalam hierarki

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (token) => {
    console.log(token)
    setUser({ token });
    await AsyncStorage.setItem('userToken', token);

  };
  const getToken = async () => {
    const tokenData =  await AsyncStorage.getItem('userToken');
    console.log(tokenData)
    return tokenData;
  };
  const logout = async () => {
    console.log("2")
    setUser(null);
    await AsyncStorage.removeItem('userToken');
    console.log("3")
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);