const STORAGE_KEY = 'locale';
const DEFAULT_LOCALE = 'FR';
const AVAILABLE_LOCALES = ['EN', 'FR'];
const EN_PATHNAME_PATTERN = /(?:^|\/)en(?:\/|$)/i;

import './style.scss';

const isSupportedLocale = (locale) => {
	return AVAILABLE_LOCALES.includes(locale);
};

const normalizeLocale = (locale) => {
	if (!locale || typeof locale !== 'string') {
		return DEFAULT_LOCALE;
	}

	const normalizedLocale = locale.trim().toUpperCase();

	if (!isSupportedLocale(normalizedLocale)) {
		return DEFAULT_LOCALE;
	}

	return normalizedLocale;
};

const getLocaleFromPathname = () => {
	if (typeof window === 'undefined') {
		return null;
	}

	if (EN_PATHNAME_PATTERN.test(window.location.pathname)) {
		return 'EN';
	}

	return null;
};

const getLocaleFromMarker = () => {
	if (typeof document === 'undefined') {
		return null;
	}

	const localeMarker = document.querySelector('[data-locale-marker]');

	if (!localeMarker) {
		return null;
	}

	const markerValue = localeMarker.getAttribute('data-locale-marker');

	if (!markerValue || !markerValue.checkVisibility?.() || typeof markerValue !== 'string') {
		return null;
	}

	const normalizedLocale = markerValue.trim().toUpperCase();

	if (!isSupportedLocale(normalizedLocale)) {
		return null;
	}

	return normalizedLocale;
};

const getDetectedLocale = () => {
	return getLocaleFromMarker() || getLocaleFromPathname();
};

const persistLocale = (locale) => {
	const normalizedLocale = normalizeLocale(locale);

	if (localStorage.getItem(STORAGE_KEY) !== normalizedLocale) {
		localStorage.setItem(STORAGE_KEY, normalizedLocale);
	}

	return normalizedLocale;
};

export const getCurrentLocale = () => {
	const storedLocale = localStorage.getItem(STORAGE_KEY);
	const normalizedStoredLocale = normalizeLocale(storedLocale);

	if (storedLocale && isSupportedLocale(normalizedStoredLocale)) {
		return normalizedStoredLocale;
	}

	const detectedLocale = getDetectedLocale();

	if (detectedLocale) {
		return persistLocale(detectedLocale);
	}

	return normalizedStoredLocale;
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
