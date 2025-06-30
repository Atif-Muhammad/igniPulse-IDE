import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const User = () => {
  return useContext(UserContext);
};
