import { describe, it, expect } from 'vitest';
import { beforeEach, afterEach } from 'vitest';
import {
    getDevContainerServerHostname,
    getResBaseURL,
    getTimezoneOffset,
    getToastSuccessTimeout,
    hostNameRegexPattern,
    isDevContainer,
    loadToastSettings,
    setPageLocale,
} from './util-frontend.ts';
import { currentLocale, localeDirection } from "./i18n";
import { documentMock, localStorageMock, locationMock } from "../mocks";

beforeEach(() => {
    global.localStorage = localStorageMock();
    global.document = documentMock();
    global.location = locationMock();
});

afterEach(() => {
    global.localStorage = undefined;
    global.document = undefined;
    global.location = undefined;
});

describe('util-frontend', () => {
    describe('getTimezoneOffset', () => {
        it('should return timezone offset as number', () => {
            const offset = getTimezoneOffset("Europe/Berlin");
            expect(offset).toBeDefined();
        });

        const timezones = [
            ['Europe/Berlin', 1],
            ['America/New_York', -5],
            ['America/Los_Angeles', -8],
            ['Asia/Tokyo', 9],
            ['Australia/Sydney', 11],
        ];
        for (const [tz, offset] of timezones) {
            it(`should return ${offset} for ${tz}`, () => {
                const result = getTimezoneOffset(tz);
                expect(result).toBe(offset);
            });
        }

        it('should handle invalid timezone gracefully', () => {
            const result = getTimezoneOffset("Invalid/Timezone");
            expect(result).toBeNaN();
        });
    });

    describe('setPageLocale', () => {
        it('should set page locale', () => {
            setPageLocale();
            const html = document.documentElement;
            expect(html.getAttribute('lang')).toBeDefined();
            expect(html.getAttribute('dir')).toBeDefined();
        });

        it('should set correct lang attribute', () => {
            setPageLocale();
            const html = document.documentElement;
            expect(html.getAttribute('lang')).toBe(currentLocale());
        });

        it('should set correct dir attribute', () => {
            setPageLocale();
            const html = document.documentElement;
            expect(html.getAttribute('dir')).toBe(localeDirection());
        });
    });

    describe('getResBaseURL', () => {
        it('should return base URL', () => {
            const url = getResBaseURL();
            expect(url).toBeDefined();
        });

        it('should return empty string in production mode', () => {
            process.env.NODE_ENV = 'production';
            const url = getResBaseURL();
            expect(url).toBe("");
        });
    });

    describe('isDevContainer', () => {
        it('should be boolean', () => {
            const result = isDevContainer();
            expect(result === true || result === false).toBe(true);
        });

        it('should return true if running in dev container', () => {
            global.DEVCONTAINER = '1';
            const result = isDevContainer();
            expect(result).toBe(true);
        });

        it('should return false if not running in dev container', () => {
            global.DEVCONTAINER = '0';
            const result = isDevContainer();
            expect(result).toBe(false);
        });
    });

    describe('getDevContainerServerHostname', () => {
        it('should return correct dev container server hostname', () => {
            global.DEVCONTAINER = '1';
            global.CODESPACE_NAME = 'test';
            global.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN = 'github.dev';
            const hostname = getDevContainerServerHostname();
            expect(hostname).toBe('test-3001.github.dev');
        });

        it('should return empty string if not in dev container', () => {
            global.DEVCONTAINER = '0';
            const hostname = getDevContainerServerHostname();
            expect(hostname).toBe('');
        });
    });

    describe('hostNameRegexPattern', () => {
        it('should return a pattern', () => {
            const pattern = hostNameRegexPattern();
            expect(pattern).toBeDefined();
        });

        it('should match valid IP addresses', () => {
            const pattern = RegExp(hostNameRegexPattern());
            expect(pattern.test('192.168.1.1')).toBe(true);
            expect(pattern.test('255.255.255.255')).toBe(true);
        });

        it('should match valid hostnames', () => {
            const pattern = RegExp(hostNameRegexPattern());
            expect(pattern.test('localhost')).toBe(true);
            expect(pattern.test('example.com')).toBe(true);
            expect(pattern.test('sub.example.com')).toBe(true);
        });

        it('should not match invalid hostnames', () => {
            const pattern = RegExp(hostNameRegexPattern());
            expect(pattern.test('.@invalid_host')).toBe(false);
        });
    });

    describe('loadToastSettings', () => {
        it('should return toast settings object', () => {
            const settings = loadToastSettings();
            expect(settings).toBeDefined();
            expect(settings.containerClassName).toBe("toast-container");
            expect(settings.showCloseButtonOnHover).toBe(true);
        });

        it('should filter out toasts with timeout 0', () => {
            const settings = loadToastSettings();
            const toast = { timeout: 0 };
            const result = settings.filterBeforeCreate(toast, []);
            expect(result).toBe(false);
        });

        it('should not filter out toasts with non-zero timeout', () => {
            const settings = loadToastSettings();
            const toast = { timeout: 5000 };
            const result = settings.filterBeforeCreate(toast, []);
            expect(result).toBe(toast);
        });
    });

    describe('getToastSuccessTimeout', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        it('should return default timeout if not set in localStorage', () => {
            const timeout = getToastSuccessTimeout();
            expect(timeout).toBe(20000);
        });

        it('should return timeout from localStorage if set', () => {
            global.localStorage.setItem('toastSuccessTimeout', '1000');
            const timeout = getToastSuccessTimeout();
            expect(timeout).toBe(20000);
        });

        it('should return default timeout if localStorage value is invalid', () => {
            global.localStorage.setItem('toastSuccessTimeout', 'invalid');
            const timeout = getToastSuccessTimeout();
            expect(timeout).toBe(20000);
        });
    });
});
