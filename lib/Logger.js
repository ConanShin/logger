var logger_1 = require('@overnightjs/logger');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
// @ts-ignore
var logPath = process.env.LOGPATH || path.resolve('../');
var parameterParser = function (parameter) {
    if (Object.keys(parameter.body).length > 0) {
        return 'Body parameters ' + JSON.stringify(parameter.body);
    }
    else if (Object.keys(parameter.query).length > 0) {
        return 'Query parameters ' + JSON.stringify(parameter.query);
    }
    else {
        return 'No parameter';
    }
};
var writeToFile = function (message, subPath) {
    var directory = logPath + "/" + subPath;
    var fileName = directory + "/" + moment().format('YYYYMMDD') + ".log";
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
        console.log('Created Directory ' + directory);
    }
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '');
        console.log('Created LogFile ' + fileName);
    }
    fs.appendFileSync(fileName, message);
};
var Log = {
    Info: function (message) {
        logger_1.Logger.Info(message);
        writeToFile(message + '\n', 'info');
    },
    Error: function (message) {
        logger_1.Logger.Err(message);
        writeToFile(message, 'error');
    }
};
exports.Log = Log;
var Logger = function (target, propertyKey, descriptor) {
    var method = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var forwarded = args[0].headers['x-forwarded-for'];
        var ip = forwarded ? forwarded.split(/, /)[0] : args[0].connection.remoteAddress;
        var restProtocol = Object.keys(args[0].route.methods)[0].toUpperCase();
        var url = args[0].originalUrl;
        Log.Info("IP: " + ip + "\tURL: " + restProtocol + " " + url + "\tFUNCTION: " + propertyKey + "\tPARAMETER: " + parameterParser(args[0]));
        method.apply(this, args).then(function () {
            var statusCode = args[1].statusCode;
            Log.Info("IP: " + ip + "\tURL: " + restProtocol + " " + url + "\tFUNCTION: " + propertyKey + "\tPARAMETER: " + parameterParser(args[0]) + " \tResponse Status: " + statusCode);
        });
    };
    return descriptor;
};
exports.Logger = Logger;
