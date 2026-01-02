
module.exports = (res, view, options, next) => {
    try {
        res.render(view, options, (err, html) => {
            if(err)
                return next(err);
            res.send(html);
        });
    } catch (err) {
        next(err);
    }
}