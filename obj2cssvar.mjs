// @ts-check
import cssesc from 'cssesc';

function* walk(obj) {
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (value === null || value === undefined) {
            // skip
            continue;
        }
        if (typeof value === 'object') {
            for (const [k, v] of walk(value)) {
                yield [`${key}-${k}`, v];
            }
        } else {
            yield [key, value];
        }
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
