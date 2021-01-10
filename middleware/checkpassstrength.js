module.exports = function isStrong(value) {
    if ((/[A-Za-z]/g).test(value)
        && (/[0-9]/g).test(value)
        && (/^(\S)/g).test(value)
        && (/(.){8,30}/g).test(value)) {
        return true
    }
    return false

}