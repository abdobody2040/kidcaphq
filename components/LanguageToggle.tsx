
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const isArabic = i18n.language.startsWith('ar');

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-xl"
      aria-label="Toggle Language"
      title={isArabic ? "Switch to English" : "Switch to Arabic"}
    >
      {isArabic ? "🇺🇸" : "🇪🇬"}
    </button>
  );
};

export default LanguageToggle;
