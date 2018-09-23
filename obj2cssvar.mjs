// @ts-check
import cssesc from 'cssesc';

function* walk(obj) {
    if (obj === null || obj == undefined) {
        return;
    }
    if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            for (const [k, v] of walk(obj[key])) {
                if (k) {
                    yield [`${key}-${k}`, v];
                } else {
                    yield [key, v];
                }
            }
        }
    } else {
        yield ['', obj];
    }
}

/**
 * @param entries {Iterable<[string, any]>}
 * @param quote {boolean}
 */
function* format(entries, quote) {
    for (const [key, value] of entries) {
        const escapedKey = cssesc(key, { escapeEverything: true });
        const wrap = quote || typeof value === 'string';
        const escapedValue = cssesc(value.toString(), { wrap });
        yield `--${escapedKey}: ${escapedValue};`;
    }
}

export default function (obj, quote = false, root = ':root') {
    const variables = format(walk(obj), quote);
    return [cssesc(root) + ' {', ...variables, '}'].join('\n');
}
