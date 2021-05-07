import { ensure, ensureType, ensureAnyOf } from './Utilities';

function validateSuggestions (suggestions:any[]) {
    return [].concat(suggestions).map((suggestion: any) => {
        const type = typeof suggestion;
        if (type === 'string') {
            suggestion = {
                on: [suggestion],
                show: suggestion,
                insertText: suggestion,
                focusText: [0, 0]
            };
        } else if (type === 'object') {
            try {
                ensure('Suggestion', suggestion, 'value');
            } catch (e) {
                ensure('Suggestion', suggestion, ['on', 'show']);
                ensureAnyOf('Suggestion', suggestion, ['insertHtml', 'insertText']);
            }

            ensureType('Suggestion', suggestion, 'on', 'string');
            ensureType('Suggestion', suggestion, 'show', 'string');
            ensureType('Suggestion', suggestion, 'value', 'string');
            ensureType('Suggestion', suggestion, 'insertText', 'string');
            ensureType('Suggestion', suggestion, 'insertHtml', 'string');

            suggestion.show = suggestion.show || suggestion.value;
            suggestion.insertText = suggestion.insertText || suggestion.value;
            suggestion.on = [suggestion.show].concat(suggestion.on || suggestion.value);

            suggestion.focusText = suggestion.focusText || [0, 0];
            if (suggestion.focusText.constructor !== Array) {
                ensureType('Suggestion', suggestion, 'focusText', 'number');
                suggestion.focusText = [suggestion.focusText, suggestion.focusText];
            }

            if (suggestion.insertHtml) {
                suggestion.focusHtml = suggestion.focusHtml || [0, 0];
                if (suggestion.focusHtml.constructor !== Array) {
                    ensureType('Suggestion', suggestion, 'focusHtml', 'number');
                    suggestion.focusHtml = [suggestion.focusHtml, suggestion.focusHtml];
                }
            }
        }

        return suggestion;
    });
}

function escapeRegExp(string: string) {
    return string.replace(/[.?+*^$[{()|\\]/g, '\\$&'); // $& means the whole matched string
}

function SuggestionList(this: any, options: any) {

    // validate options
    if (options && !options.values) {
        options = { values: options };
    }

    ensure('SuggestionList', options, 'values');
    ensureType('Suggestion', options, 'trigger', 'string');
    options.caseSensitive = Boolean(options.caseSensitive);

    if (typeof options.values === 'function') {
        this.getSuggestions = function (keyword: any, callback: (arg0: any[]) => any) {
            options.values.call(this, keyword, (values: any[]) => callback(validateSuggestions(values)));
        };
    } else if (options.values.constructor === Array || typeof options.values === 'string') {
        options.values = validateSuggestions(options.values);
        this.getSuggestions = (keyword: any, callback: (arg0: any) => void) => {
            const flags = !options.caseSensitive ? 'i' : '';
            const triggerRegex = this.trigger ? `(?:${escapeRegExp(this.trigger)})?` : '';
            const commonRegex = '^' + triggerRegex + escapeRegExp(keyword);

            const matcher = new RegExp(commonRegex, flags);
            const exactMatcher = new RegExp(commonRegex + '$', flags);

            callback (
                options.values.filter((value: { on: any[]; }) => (
                    value.on.some((entry: string) => (
                        matcher.test(entry) && !exactMatcher.test(entry)
                    ))
                ))
            );
        };
    }

    this.trigger = options.trigger;
    if (this.trigger) {
        const escapedTrigger = escapeRegExp(this.trigger)
        this.regex = new RegExp(`(?:\\W+|^)${escapedTrigger}(\\S*)$`);
    } else {
        this.regex = new RegExp('(?:^|\\s+)(\\S+)$');
    }
}

SuggestionList.prototype.getMatch = function (value: { match: (arg0: any) => any[]; }) {
    return value.match(this.regex)[1];
};

export default SuggestionList;
