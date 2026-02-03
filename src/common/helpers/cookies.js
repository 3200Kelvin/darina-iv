import Cookies from 'js-cookie'

export const setCookie = (name, value, days = 14) => {
    const stringifiedValue = JSON.stringify(value);
    Cookies.set(name, stringifiedValue, { expires: days })
};

export const getCookie = (name) => {
    const value = Cookies.get(name);
    return value ? JSON.parse(value) : null;
};