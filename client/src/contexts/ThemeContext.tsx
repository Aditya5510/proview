import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCustomization, updateCustomization } from "@/api/User";

export interface CustomizationSettings {
  theme: string;
  font: string;
  animation: string;
  backgroundPattern: string;
  darkMode: boolean;
  animationSpeed: number;
}

interface ThemeContextType {
  settings: CustomizationSettings;
  loading: boolean;
  updateSettings: (
    newSettings: Partial<CustomizationSettings>
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
  applyTheme: () => void;
}

const defaultSettings: CustomizationSettings = {
  theme: "minimal",
  font: "inter",
  animation: "fade",
  backgroundPattern: "none",
  darkMode: false,
  animationSpeed: 0.5,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [settings, setSettings] =
    useState<CustomizationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettingsFromDB = async () => {
      try {
        const userString = localStorage.getItem("user");
        const authToken = localStorage.getItem("authToken");

        if (userString && authToken) {
          const user = JSON.parse(userString);
          const userWithToken = { ...user, token: authToken };

          const response = await getCustomization(userWithToken);
          if (response.success && response.customization) {
            setSettings({ ...defaultSettings, ...response.customization });
            console.log(
              "Settings loaded from database:",
              response.customization
            );
          } else {
            setSettings(defaultSettings);
            console.log("No customization found in database, using defaults");
          }
        } else {
          setSettings(defaultSettings);
          console.log("No user authenticated, using defaults");
        }
      } catch (error) {
        console.error("Error loading customization from database:", error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettingsFromDB();
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const userString = localStorage.getItem("user");
        const authToken = localStorage.getItem("authToken");

        if (userString && authToken) {
          const user = JSON.parse(userString);
          const userWithToken = { ...user, token: authToken };

          const response = await getCustomization(userWithToken);
          if (response.success && response.customization) {
            setSettings({ ...defaultSettings, ...response.customization });
            console.log(
              "Settings loaded from database for user change:",
              response.customization
            );
          } else {
            setSettings(defaultSettings);
            console.log(
              "No customization found in database for user change, using defaults"
            );
          }
        } else {
          setSettings(defaultSettings);
          console.log("User logged out, using defaults");
        }
      } catch (error) {
        console.error("Error loading customization after auth change:", error);
        setSettings(defaultSettings);
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const updateSettings = async (
    newSettings: Partial<CustomizationSettings>
  ) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      const userString = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      if (userString && authToken) {
        const user = JSON.parse(userString);
        const userWithToken = { ...user, token: authToken };

        const response = await updateCustomization(userWithToken, updated);
        if (response.success) {
          console.log("Settings saved to database:", updated);
        } else {
          console.error("Failed to save settings to database:", response.error);
        }
      } else {
        console.log("No user authenticated, settings not saved to database");
      }
    } catch (error) {
      console.error("Error saving settings to database:", error);
    }
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);

    try {
      const userString = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      if (userString && authToken) {
        const user = JSON.parse(userString);
        const userWithToken = { ...user, token: authToken };

        const response = await updateCustomization(
          userWithToken,
          defaultSettings
        );
        if (response.success) {
          console.log("Settings reset in database");
        } else {
          console.error(
            "Failed to reset settings in database:",
            response.error
          );
        }
      } else {
        console.log("No user authenticated, settings not reset in database");
      }
    } catch (error) {
      console.error("Error resetting settings in database:", error);
    }
  };

  const applyTheme = () => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.classList.remove(
      "theme-minimal",
      "theme-elegant",
      "theme-modern",
      "theme-classic"
    );
    document.documentElement.classList.add(`theme-${settings.theme}`);

    const fontFamilies: { [key: string]: string } = {
      inter: "Inter, sans-serif",
      poppins: "Poppins, sans-serif",
      roboto: "Roboto, sans-serif",
      playfair: "Playfair Display, serif",
      montserrat: "Montserrat, sans-serif",
      opensans: "Open Sans, sans-serif",
      raleway: "Raleway, sans-serif",
      nunito: "Nunito, sans-serif",
      sourcecodepro: "Source Code Pro, monospace",
      merriweather: "Merriweather, serif",
      monospace: "monospace",
    };

    const selectedFont = fontFamilies[settings.font] || fontFamilies.inter;
    document.documentElement.style.setProperty("--font-family", selectedFont);

    document.body.classList.remove(
      "bg-pattern-gradient",
      "bg-pattern-geometric",
      "bg-pattern-organic",
      "bg-pattern-minimal"
    );
    if (settings.backgroundPattern !== "none") {
      document.body.classList.add(`bg-pattern-${settings.backgroundPattern}`);
    }
  };

  useEffect(() => {
    applyTheme();
  }, [settings]);

  const value: ThemeContextType = {
    settings,
    loading,
    updateSettings,
    resetSettings,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
