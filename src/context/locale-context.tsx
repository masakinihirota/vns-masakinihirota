'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { getMessages, getNestedMessage, type Locale } from '@/i18n/get-messages';

interface LocaleContextType {
    locale: Locale;
    t: (key: string) => string;
    changeLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
    children: ReactNode;
    initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
    const changeLocale = useCallback((newLocale: Locale) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
            window.location.reload();
        }
    }, []);

    const locale = initialLocale;

    const t = useCallback(
        (key: string): string => {
            return getNestedMessage(locale, key);
        },
        [locale]
    );

    return (
        <LocaleContext.Provider value={{ locale, t, changeLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

/**
 * LocaleContext を使用する hook
 * @throws {Error} LocaleProvider 外で呼び出された場合
 */
export function useLocale(): LocaleContextType {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider');
    }
    return context;
}
