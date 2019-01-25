
const hasArrayObjectsDuplicate = (arrayObj, fieldName) => {

    if(fieldName && Array.isArray(arrayObj) && arrayObj.length > 0) {
        let s = new Set();
        let sLength = s.size;

        for(let i = 0; i < arrayObj.length; i++) {
            s.add(arrayObj[i][fieldName]);
            if(s.size === sLength) return true;

            sLength = s.size;
        }
        return false;
    }

}

const getErrorObj = (name) => {
    let e = new Error(name);
    e.name = name;
    return e;
}

module.exports = {
    hasArrayObjectsDuplicate,
    getErrorObj
}