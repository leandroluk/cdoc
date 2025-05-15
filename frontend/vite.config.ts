import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'node:path';
import {defineConfig} from 'vite';

dotenvExpand.expand(dotenv.config());

// https://vite.dev/config/
export default defineConfig({
  plugins: Array().concat(react(), tailwindcss()),
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
      'package.json': path.resolve(__dirname, 'package.json'),
    },
  },
  server: {
    https: {
      cert: [
        '-----BEGIN CERTIFICATE-----\n',
        'MIIDCTCCAfGgAwIBAgIUcG2+XL6wbIOqaLD5BSGDavYtrtUwDQYJKoZIhvcNAQEL\n',
        'BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI1MDUwODE2MDAyOFoXDTI2MDUw\n',
        'ODE2MDAyOFowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF\n',
        'AAOCAQ8AMIIBCgKCAQEA175KElXqCsXWuNj92EMjUnT7gXyFyfW4pWvtpQKIO+qu\n',
        'jDQ4rNdx1aHQJs33cN+0fJm1LP0yrN8mEl2YJUyivPhXUa6cPgsnbWW3qqWaZVEk\n',
        '5VGs64QxWjSgTsvh/TlhFH49/KCymF49FpX0Q+d4uaBecVu/UtKmlLwgA0cGgF3h\n',
        'ejYwTzBPZYKhuM55Cd2oX0UsifpLjYCsHaUF2yDVRGRpI57qgoIAYi5T7CKMcRnO\n',
        'O89+wK2TwaBiUXvfBjyUknRi8Wt9nK3PV/QwJwjpmeMdWZZBU/8IApQKLshzjuws\n',
        'KdmgJ5BbMGaS9MHQUZvPqUHNoMBmIqmBjMMUi7974QIDAQABo1MwUTAdBgNVHQ4E\n',
        'FgQUK1XVaz4ysIfhl+jRsGWpKT54uDAwHwYDVR0jBBgwFoAUK1XVaz4ysIfhl+jR\n',
        'sGWpKT54uDAwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEArhYh\n',
        '6Ei/+5QHbk2gdAJsoBKJIQlLedAX+X6FHFIcwb3kGZcihWSG9kVI/VSRejiXL4Zh\n',
        'ELw28u9X3LS6F6NUYsu/nPa9dbvdgHLxKeLO8H93736eCSnLRxFGcYIduBhrFAx9\n',
        'upTh2DvOEEuyfiF6GpEBYSCp/B7hEAkyRmC/gJIwJ4bdYSbfTZ0MtjqsbPhK/1lp\n',
        'BrAFjtxuRXsv3Kgu3N+AHJk45UlwWt+mhtCzBHb2eDuQcOHR1Aqr48SHcCpk3TCr\n',
        't3Jt/h0Jn0lrluLMvbmDc2SC7cPFNA78hM7fHRn/6YrZ2Jj9Pg6I4qdOVs9ySCno\n',
        'WhQvTRVIOxZF+XEaRA==\n',
        '-----END CERTIFICATE-----',
      ].join(''),
      key: [
        '-----BEGIN PRIVATE KEY-----\n',
        'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDXvkoSVeoKxda4\n',
        '2P3YQyNSdPuBfIXJ9bila+2lAog76q6MNDis13HVodAmzfdw37R8mbUs/TKs3yYS\n',
        'XZglTKK8+FdRrpw+CydtZbeqpZplUSTlUazrhDFaNKBOy+H9OWEUfj38oLKYXj0W\n',
        'lfRD53i5oF5xW79S0qaUvCADRwaAXeF6NjBPME9lgqG4znkJ3ahfRSyJ+kuNgKwd\n',
        'pQXbINVEZGkjnuqCggBiLlPsIoxxGc47z37ArZPBoGJRe98GPJSSdGLxa32crc9X\n',
        '9DAnCOmZ4x1ZlkFT/wgClAouyHOO7Cwp2aAnkFswZpL0wdBRm8+pQc2gwGYiqYGM\n',
        'wxSLv3vhAgMBAAECggEAAkjxJuP2QE2Os+yuAsbY2zkC9IDTN+upNeAaDbsK1bue\n',
        'd2/fWjFHJhCT9rBywPH7/hMKRxYz0OUYiNRCvFsx7aQ7SutGNPM2sS/R5w96JNco\n',
        '3i1KknOXEQU13dYtKA3q0cxxr2wr4aijc/3iYhlTy+Xl0JFWShqSChXUYirnGwZR\n',
        'utBWt7WdjDYR+xsGx+wvEjqWMR9b+ZxzkYEncyhlMNXxgfJWwgZrIXPZo2Bih1rM\n',
        'jpchaanP6BtbK0yO6ZMoKizEn08PmVuLEHvcybjJonpjv46jCUbXJJMub5OBqjZr\n',
        '57gHKw8xJhqA9tAPasDPM/RT9JjQ1I5eFL0SKeM5UwKBgQD5pFpFmicR/iP94XrB\n',
        'Q4wumWeZvth1wxjSpRdWfxI79UD3j7wQGTUD+2A0inB0VHEbsJi/3XhR882uk2zh\n',
        '3zV2QMCVwYLNdfTpe/70Gqt1tVvwW/I8pLQwbHG99sEIl/459BsQYhnsElWEv2/Y\n',
        'akCP2XkBN0xuG6manXf4kzkb/wKBgQDdPOt4NO6EGOoYSZXtMvMYnskre5hWvfdw\n',
        'mArqzzlKaA7rzyz8IpG2x0vblQb+y82AbLeAJyxE0kM9JT6/SeSU/qGenQNQb1Px\n',
        'ZLUkvpbbi2lUCChaueLdHPd5MatrEXPu1rkuewMQLx+sPim4BMdeEYi69RmY4aN/\n',
        'jSrWIYroHwKBgQCDNAntwtL99d/cswDdSi8G3sFAYLlLSzpkmzfk0ew3bvKyKezh\n',
        'WR4v9ZHei1QHD8pSj0H4tOFj0Qss0XbMT4+9ktKk4otoiLIrdGvOx6WNu7+SWAC8\n',
        'NqQtPxGYkXNqnNeUheMjfSu6kvg3SJXz3AQKlnWuWe3lgMxm4pQHJPlC6QKBgDbW\n',
        'BrdAx23Ojxd+Bb9JRZ/wm4Q/mj7FzzMFPI9+1YBv0mL4cvn7x4o6U78VbSpycXlH\n',
        'eSQ2kW5tf2UEek0Hj7SueHjMCipBrdjDUXLOGq5IG89MRlRWhrivmVdczFQ5ezbT\n',
        '2gp/Sv8T7xHORqDp7lCOoAlW/wU5yECxSNDSd4+ZAoGBAPZHP/IVh5cEu8XREUVe\n',
        'L0tKnOMDHZfG13sxQ0HkiE/seS3P9n7ZYbMelX5NaoEMBezxDdAdtxAwkRLolR3k\n',
        'fsCeQP5M8RKJ4ZC/qgeq0BtOs9fHwRhHgKvXKApAuxSDihWLJ6w8xvMA+JoUmZY/\n',
        'VNoZ4OJWMqQEprurawjASXOU\n',
        '-----END PRIVATE KEY-----',
      ].join(''),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'vendor/react-dom';
            }
            if (id.includes('react')) {
              return 'vendor/react';
            }
          }
        },
      },
    },
  },
});
