import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n.use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        debug: true,
        // returnObjects: true,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
    });