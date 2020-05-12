export function smartTrim(string, maxLength) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength == 1) return string.substring(0, 1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxLength;
    var lstrip = Math.ceil(toremove / 2);
    var rstrip = toremove - lstrip;
    return string.substring(0, midpoint - lstrip) + '...'
        + string.substring(midpoint + rstrip);
}

export function usingCorrectNetwork(currentNetwork) {
    if (!currentNetwork || currentNetwork === null) return false
    if (currentNetwork === process.env.NETWORK) return true
    return false
}