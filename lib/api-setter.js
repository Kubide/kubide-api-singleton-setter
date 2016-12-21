"use strict";
var _ = require('lodash'),
    i18n = require('i18n-xlocale');



/**
 * Initialize
 *
 * @returns {Function}
 */
function init(){
    return function (req, res, next) {
        if (!req.api){
            req.api = {
                find : {
                    query : {},
                    projection : {}
                },
                pagination : {},
                sort : {},
                route : {}
            };
        }

        req.api.locale = i18n.getLocale();
        next();
    };
}


/**
 * Handle search parameter and convert it to mongoose params
 *
 * @param options
 * @returns {Function}
 */
function search(options){

    options = _.merge({
        language : "es",
        queryIndex : "textScore",
        queryScore : "queryScore"
    }, options);



    return function (req, res, next) {

        // we use the param query.fs for fullsearch
        if (req.query.fs) {

            if (req.api.locale) {
                options.language = req.api.locale.substring(0,2)
            }

            req.api.find.query.$text = {
                $search: req.query.fs,
                $language: options.language
            };

            req.api.find.projection = {};
            req.api.find.projection[options.queryScore] = { $meta: options.queryIndex};

            if (!req.query.sort) {
                req.api.sort[options.queryScore] = { $meta: options.queryIndex}
            }
        }
        next();
    };
}

/**
 * Handle sort parameter and convert it to mongoose params
 * @param options
 * @returns {Function}
 */
function sort(options){
    return function (req, res, next) {

        if (req.query.sort) {
            var sortArray = req.query.sort.split(',');
            var sortObj = {};

            sortArray.forEach(function (field) {
                var prefix = 1;

                if (field.match(/-/)) prefix = -1;
                field = field.replace(/-|\s/g, '');


                sortObj[field] = prefix;

            });

            req.api.sort = sortObj;
        }

        next();
    };
}


/**
 * Handle limit and page parameters and convert it to mongoose params
 *
 * @param options
 * @returns {Function}
 */
function pagination(options){
    options = _.merge({
        limit : 10,
        page : 1,
        export : false
    }, options);

    return function (req, res, next) {
        let reqOptions = _.merge(options, req.query);

        if (reqOptions.export) {
            reqOptions.limit = 0;
        }

        req.api.pagination.limit = parseInt(reqOptions.limit);
        req.api.pagination.page = parseInt(reqOptions.page);
        req.api.pagination.skip = (reqOptions.page > 0 ? ((reqOptions.page - 1) * reqOptions.limit) : 0);

        next();
    };
}



/**
 * Handle schema params in order to use between the app
 *
 * @param defaults
 * @returns {Function}
 */
function schema(defaults){
    return function (req, res, next) {
        req.api.schema = req.query.schema;

        next();
    };
}


module.exports = {
    init : init,
    search : search,
    sort : sort,
    pagination : pagination,
    schema : schema
};