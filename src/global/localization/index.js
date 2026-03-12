const STORAGE_KEY = 'locale';
const DEFAULT_LOCALE = 'EN';
const AVAILABLE_LOCALES = ['EN', 'FR'];

import './style.scss';

const normalizeLocale = (locale) => {
	if (!locale || typeof locale !== 'string') {
		return DEFAULT_LOCALE;
	}

	const normalizedLocale = locale.trim().toUpperCase();

	if (!AVAILABLE_LOCALES.includes(normalizedLocale)) {
		return DEFAULT_LOCALE;
	}

	return normalizedLocale;
};

export const getCurrentLocale = () => {
	return normalizeLocale(localStorage.getItem(STORAGE_KEY));
};

export const setCurrentLocale = (locale) => {
	const normalizedLocale = normalizeLocale(locale);

	localStorage.setItem(STORAGE_KEY, normalizedLocale);

	return normalizedLocale;
};

export const applyCurrentLocale = () => {
	const currentLocale = getCurrentLocale();

	document.documentElement.setAttribute('data-locale-current', currentLocale);

	return currentLocale;
};

export const useLocalization = () => {
	const localeLinks = document.querySelectorAll('[data-locale-link]');

	if (!localeLinks.length) {
		applyCurrentLocale();
		return;
	}

	const onLocaleLinkClick = (event) => {
		event.preventDefault();

		const locale = event.currentTarget.dataset.localeLink;

		setCurrentLocale(locale);
		applyCurrentLocale();
	};

	localeLinks.forEach((link) => {
		link.addEventListener('click', onLocaleLinkClick);
	});

	applyCurrentLocale();

	return () => {
		localeLinks.forEach((link) => {
			link.removeEventListener('click', onLocaleLinkClick);
		});
	};
};
