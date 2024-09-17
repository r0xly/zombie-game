import { SHOW_DEBUG_LOG } from "../config";
import { Server } from "../server";

export const enum ServerLogType 
{
    WARNING = "WARNING",
    DEBUG = "DEBUG",
    ERROR = "ERROR",
    LOG = "LOG",
}

export class LogsController
{
    constructor(private server: Server)
    {

    }

    log(type: ServerLogType, content: string) 
    {
        const message = `[\x1b[33mSERVER ${type}\x1b[0m] ${content}`; 

        if (type === ServerLogType.ERROR) 
        {
            console.error(message);
        }
        else if (type === ServerLogType.WARNING) {
            console.warn(message);
        }
        else if (type === ServerLogType.DEBUG && SHOW_DEBUG_LOG)       // This prevents any debug messages from logging when SHOW_DEBUG_LOG is set to false
        {
            console.log(message);
        }
    }

}