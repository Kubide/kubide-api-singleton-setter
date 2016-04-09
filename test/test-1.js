'use strict';
var chai = require("chai"),
    supertest = require('supertest'),
    should = chai.should(),
    express = require('express'),
    apiSetter = require('../index'),
    app,
    options = {};


describe('basic usage', function () {
    //setup server
    before(function(){
        app = express();
        app.use(apiSetter.init());
        app.use(apiSetter.search());
        app.use(apiSetter.sort());
        app.use(apiSetter.pagination());
        app.use(apiSetter.schema());

        app.get('/', function (req, res) {
            res.json(req.api);
        });
    });

    it('get default settings', function (done) {
        supertest(app)
            .get("/")
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.have.property("pagination");
                res.body.pagination.should.have.property("limit",10);
                res.body.pagination.should.have.property("page",1);
                res.body.pagination.should.have.property("skip",0);
                done();
            });
    });

    it('get default settings', function (done) {
        supertest(app)
            .get("/?page=2&limit=20&fs=test")
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {

                should.not.exist(err);
                res.body.should.have.property("pagination");
                res.body.pagination.should.have.property("limit",20);
                res.body.pagination.should.have.property("page",2);
                res.body.pagination.should.have.property("skip",20);

                res.body.should.have.property("find");
                res.body.find.should.have.property("query");
                res.body.find.should.have.property("projection");

                res.body.should.have.property("sort");

                done();
            });
    });


});

