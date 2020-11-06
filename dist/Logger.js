"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.Logger = void 0;
var logger_1 = require("@overnightjs/logger");
var path = require("path");
var fs = require("fs");
var moment = require("moment");
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
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var forwarded, ip, restProtocol, url, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        forwarded = args[0].headers['x-forwarded-for'];
                        ip = forwarded ? forwarded.split(/, /)[0] : args[0].connection.remoteAddress;
                        restProtocol = Object.keys(args[0].route.methods)[0].toUpperCase();
                        url = args[0].originalUrl;
                        Log.Info("IP: " + ip + "\tURL: " + restProtocol + " " + url + "\tFUNCTION: " + propertyKey + "\tPARAMETER: " + parameterParser(args[0]));
                        return [4 /*yield*/, method.apply(this, args)];
                    case 1:
                        _a.sent();
                        statusCode = args[1].statusCode;
                        Log.Info("IP: " + ip + "\tURL: " + restProtocol + " " + url + "\tFUNCTION: " + propertyKey + "\tPARAMETER: " + parameterParser(args[0]) + " \tResponse Status: " + statusCode);
                        return [2 /*return*/];
                }
            });
        });
    };
    return descriptor;
};
exports.Logger = Logger;
