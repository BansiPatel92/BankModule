var replacer = function (key, value) {
    if (typeof value === "string" && (value == null || !value || value == "")) {
        return undefined;
    }
    if (typeof value === "number" && (value == null || !value || value == 0)) {
        return undefined;
    }
    if (typeof value === "object" && (value == null || !value || Object.keys(value).length == 0)) {
        return undefined;
    }
    return value;
}

module.exports = replacer;