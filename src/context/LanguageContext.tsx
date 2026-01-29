"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState("en");

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export { LanguageProvider, useLanguage };