export const localStorageMock = () => {
    let store: { [key: string]: string } = {};
    return {
        locale: 'en',
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value;
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
};

export const documentMock = () => ({
    documentElement: {
        _attributes: {},
        setAttribute: function(qualifiedName: string, value: string) {
            this._attributes[qualifiedName] = value;
        },
        getAttribute(qualifiedName: string): string {
            return this._attributes[qualifiedName];
        }
    },
});

export const locationMock = () => ({
    protocol: 'http:',
    hostname: 'localhost',
});
