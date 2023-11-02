/**
 * Schema output constants for data schema described in https://github.com/skodapetr/data-schema/tree/main
 */

export const prefixes = {
    dsc: 'http://example.com/data-schema/core/',
};

export const core = {
    Entity: `${prefixes.dsc}Entity`,
    Property: `${prefixes.dsc}Property`,
    technicalName: `${prefixes.dsc}technicalName`,
};
