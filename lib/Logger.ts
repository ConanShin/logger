import {Logger as log} from '@overnightjs/logger'
import * as path from 'path'
import * as fs from 'fs'
import moment = require('moment')
const logPath = process.env.LOGPATH || path.resolve('../')

const parameterParser = (parameter: any) => {
    if ( Object.keys(parameter.body).length > 0 ) {
        return 'Body parameters ' + JSON.stringify(parameter.body)
    } else if ( Object.keys(parameter.query).length > 0 ) {
        return 'Query parameters ' + JSON.stringify(parameter.query)
    } else {
        return 'No parameter'
    }
}

const writeToFile = (message: string, subPath: string) => {
    const directory = `${logPath}/${subPath}`
    const fileName = `${directory}/${moment().format('YYYYMMDD')}.log`
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
        console.log('Created Directory ' + directory)
    }
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '')
        console.log('Created LogFile ' + fileName)
    }
    fs.appendFileSync(fileName, message)
}

const Log = {
    Info: (message: string) => {
        log.Info(message)
        writeToFile(message + '\n', 'info')
    },
    Error: (message: string) => {
        log.Err(message)
        writeToFile(message, 'error')
    }
}

const Logger = function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const method = descriptor.value
    descriptor.value = async function (...args: any[]) {
        const forwarded = args[0].headers['x-forwarded-for']
        const ip = forwarded ? forwarded.split(/, /)[0] : args[0].connection.remoteAddress
        const restProtocol = Object.keys(args[0].route.methods)[0].toUpperCase()
        const url = args[0].originalUrl
        Log.Info(`IP: ${ip}\tURL: ${restProtocol} ${url}\tFUNCTION: ${propertyKey}\tPARAMETER: ${parameterParser(args[0])}`)
        await method.apply(this, args)

        const statusCode = args[1].statusCode
        Log.Info(`IP: ${ip}\tURL: ${restProtocol} ${url}\tFUNCTION: ${propertyKey}\tPARAMETER: ${parameterParser(args[0])} \tResponse Status: ${statusCode}`)
    }
    return descriptor
}

export default {Logger, Log}