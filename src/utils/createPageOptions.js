
const createPageOptions = (page, title, messageType, message) => {
    return {
        activePage: page,
        pageTitle: title,
        messageType: messageType,
        message: message
    };
};

module.exports = createPageOptions;