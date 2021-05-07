export const ensure = (context: string, object: any, keys: any | ConcatArray<any> | string[]) => {
    [].concat(keys).forEach(key => {
        if (typeof object[key] === 'undefined') {
            throw new Error(`AutoSuggest: Missing required parameter, ${context}.${key}`);
        }
    });
};
export const ensureAnyOf = (context: string, object: any, keys: any[]) => {
    let currentKey;
    if (!keys.some((key: any) => (
        typeof object[currentKey = key] !== 'undefined'
    ))) throw new Error(`AutoSuggest: Missing required parameter, ${context}.${currentKey}`);
};
export const ensureType = (context: string, object: any, key: string, type: string) => {
    [].concat(object[key]).forEach(value => {
        const valueType = typeof value;
        if (valueType !== type && valueType !== 'undefined') {
            throw new TypeError(`AutoSuggest: Invalid Type for ${context}.${key}, expected ${type}`);
        }
    });
};

export const getComputedStyle = (element: Element, style: string) =>
    window.getComputedStyle(element).getPropertyValue(style);

export const getGlobalOffset = ($0: any) => {
    let node = $0, top = 0, left = 0;

    do {
        left += node.offsetLeft;
        top += node.offsetTop;
    } while (node = node.offsetParent);

    return {left, top};
};

export const getScrollLeftForInput = (input) => {
    if (input.createTextRange) {
        const range = input.createTextRange();
        const inputStyle = window.getComputedStyle(input);
        const paddingLeft = parseFloat(inputStyle.paddingLeft);
        const rangeRect = range.getBoundingClientRect();
        return input.getBoundingClientRect().left + input.clientLeft + paddingLeft - rangeRect.left;
    } else {
        return input.scrollLeft;
    }
};

export const getCursorPosition = (input: any) => {
    return [input.selectionStart, input.selectionEnd].sort((a, b) => a - b);
};

export const getSelectedTextNodes = () => {
    const selection: any = window.getSelection();
    const range = selection.getRangeAt(0);

    let { startContainer, startOffset, endContainer, endOffset } = range;
    const direction = (
        selection.anchorNode === startContainer &&
        selection.anchorOffset === startOffset
    );

    if (startContainer.nodeType !== startContainer.TEXT_NODE) {
        startContainer = startContainer.childNodes[startOffset - 1];
        if (startContainer) {
            startContainer = getLastChildNode(startContainer);
            startOffset = startContainer.nodeValue ? startContainer.nodeValue.length : 0;
        }
    }

    if (endContainer.nodeType !== endContainer.TEXT_NODE) {
        endContainer = endContainer.childNodes[endOffset];
        if (endContainer) {
            endContainer = getFirstChildNode(endContainer);
            endOffset = 0;
        }
    }

    return { startContainer, startOffset, endContainer, endOffset, direction };
};

export const makeAsyncQueueRunner = () => {
    let i = 0;
    let queue: any[] = [];

    return (f: any, j: number) => {
        queue[j - i] = f;
        while (queue[0]) ++i, queue.shift()();
    };
};

export const data = (element: any , key: string, value?: number | boolean | undefined) => {
    key = 'autosuggest_' + key;
    if (typeof value !== 'undefined') {
        element.dataset[key] = JSON.stringify(value);
    } else {
        value = element.dataset[key];
        return typeof value !== 'undefined' ? JSON.parse(element.dataset[key]) : value;
    }
};

export const createNode = (html: string) => {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
};

export const getFirstChildNode = (node: Node) => {
    let nextNode = node;
    while (nextNode.firstChild) nextNode = nextNode.firstChild;
    return nextNode;
};

export const getLastChildNode = (node: Node) => {
    let nextNode = node;
    while (nextNode.lastChild) nextNode = nextNode.lastChild;
    return nextNode;
};
