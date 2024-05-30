import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { colors } from "../../config/colors";

const ThemeContext = createContext();

/**
 *
 * @returns {{
 *   setDark: () => void;
 *   setLight: () => void;
 *   setTheme: (v: string) => void;
 *   theme: {
 *     name: string;
 *     label: string;
 *     brand: string;
 *     primary: string;
 *     secondary: string;
 *     secondaryFaded: string;
 *     textSecondary: string;
 *     blue: string;
 *     textPrimary: string;
 *     badgeTextColor: string;
 *     screenTitleShadow: string;
 *     screenTitlePrimary: string;
 *     screenTitleStroke: string;
 *     navBarShadow: string;
 *     dropDownColor: string;
 *     white: string;
 *     errorMsg: string;
 *     disabled: string;
 *     black: string;
 *     edit: string;
 *     success: string;
 *     semi: string;
 *     pendingColor: string;
 *     bottomTabShadow: string;
 *     navItemShadow: string;
 *     tableBorder: string;
 *     logoSecondary: string;
 *   };
 * }}
 */
export default function useTheme() {
  const [themeName, setThemeName] = useContext(ThemeContext);
  return {
    setDark: () => {
      window.localStorage.setItem("crmTheme", "dark");
      setThemeName("dark");
    },
    setLight: () => {
      window.localStorage.setItem("crmTheme", "light");
      setThemeName("light");
    },
    theme: colors[themeName],
    setTheme: (v) => {
      window.localStorage.setItem(
        "crmTheme",
        v || (v === "dark" ? "light" : "dark")
      );
      setThemeName(v || (v === "dark" ? "light" : "dark"));
    },
  };
}

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("dark");
  useEffect(() => {
    let theme = window.localStorage.getItem("crmTheme");
    if (theme && colors[theme]) {
      setThemeName(theme);
    } else {
      setThemeName("dark");
      window.localStorage.setItem("crmTheme", "dark");
    }
  }, []);
  return (
    <ThemeContext.Provider value={[themeName, setThemeName]}>
      <StyledThemeProvider theme={colors[themeName]}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
