export const $log = import.meta.env.DEV ? console.log : () => {};

export const $warn = import.meta.env.DEV ? console.warn : () => {};

export const $info = import.meta.env.DEV ? console.info : () => {};

export const $error = import.meta.env.DEV ? console.error : () => {};
