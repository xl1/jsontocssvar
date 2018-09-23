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

function* format(entries) {
    for (const [key, value] of entries) {
        const escapedKey = cssesc(key, { isIdentifier: true });
        const escapedValue = cssesc(value.toString(), { wrap: typeof value === 'string' });
        yield `--${escapedKey}: ${escapedValue};`;
    }
}

export default function (obj, root = ':root') {
    const variables = format(walk(obj));
    return [cssesc(root) + ' {', ...variables, '}'].join('\n');
}
