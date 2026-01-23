export class SessionStorage {
    static get(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    static set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        sessionStorage.removeItem(key);
    }
}