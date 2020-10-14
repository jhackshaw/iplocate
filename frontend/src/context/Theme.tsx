import React, { useEffect } from "react";
import { themes } from "./themes";

interface ThemeCtx {}

const ThemeContext = React.createContext<ThemeCtx>(undefined!);

export const ThemeProvider: React.FC = (props) => {
  const { children } = props;

  const setColors = () => {
    const root = document.documentElement;
    Object.entries(themes.light).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
  };

  useEffect(setColors, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};
