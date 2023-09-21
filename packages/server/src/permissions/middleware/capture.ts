import { Database, NewApiUsageRecord } from "@mock-mate/database";
import { Context, Next } from "koa";

export const apiUsageMiddleware = async (ctx: Context, next: Next, database: Database) => {
    const { nickname, path } = ctx.params;
    const startTime = Date.now();
  
    await next(); // Continue to the next middleware and eventually come back
  
    const endTime = Date.now();
    const responseTime = endTime - startTime;
  
    const method = ctx.request.method;
    const statusCode = ctx.response.status;
    const dataLength = ctx.response.length || 0;
    const ipAddress = ctx.request.ip;
    const data: NewApiUsageRecord = {
        apiNickname: nickname,
        endpointPath: path,
        method: method,
        statusCode: statusCode,
        responseTime: responseTime,
        dataLength: dataLength,
        ipAddress: ipAddress
    }
    // Record the API usage in the database
    await database.addApiUsage(data);
  };