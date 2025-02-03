
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// export to api request
module.exports = function () {
    
    this.sanitize = (string) => {
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        return DOMPurify.sanitize(string);
    }
    
}