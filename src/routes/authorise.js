const express = require('express');
const authoriseRouter = express.Router();
const request = require('request');

module.exports = function () {
    authoriseRouter.route('/')
        .post(function (req, res) {
            request({
                method: 'POST',
                uri: `${process.env.uri}/api/login`,
                json: true,
                jar: true,
                body: {
                    username: process.env.username,
                    password: process.env.password
                },
                agentOptions: {
                    rejectUnauthorized: false //Allow Self-signed cert
                }
            }, function (err, response, body) {
                if (err) {
                    console.error(err.stack); 
                    res.send('An error has occurred');
                    return; 
                }
                console.info(body);
                request({
                    method: 'POST',
                    uri: `${process.env.uri}/api/s/${process.env.sitename}/cmd/stamgr`,
                    json: true,
                    jar: true,
                    body: {
                        cmd: 'authorize-guest',
                        mac: req.session.macAddr
                    },
                    agentOptions: {
                        rejectUnauthorized: false //Allow Self-signed cert
                    }
                }, function (err, response, body) {
                    if (err) {
                        console.error(err.stack);
                        res.send('An error has occurred');
                        return; 
                        }
                    console.info(body);
                    res.redirect('https://google.co.uk');
                    request({
                        method: 'POST',
                        uri: `${process.env.uri}/logout`,
                        jar: true,
                        agentOptions: {
                            rejectUnauthorized: false //Allow Self-signed cert
                        }
                    }, function (err, response, body) {
                        if (err) {
                            console.error(err.stack);
                            return;
                        }
                        console.info(body);
                    });
                });
            });
        });
    return authoriseRouter;
};