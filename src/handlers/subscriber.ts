import { Callback, Context, Handler } from 'aws-lambda';
import * as HttpStatus from 'http-status-codes';
import { ISubscriberVerifyRequestParams, ISubscriberVerifyResponse } from '../types';

const verify: Handler = (event: any, context: Context, callback: Callback) => {
    let response: ISubscriberVerifyResponse;

    const validationCode = process.env.SUBSCRIBER_VERIFICATION_CODE;
    const queryStringParameters: ISubscriberVerifyRequestParams = event.queryStringParameters as ISubscriberVerifyRequestParams;

    if (!queryStringParameters || !queryStringParameters.verify || queryStringParameters.verify !== validationCode) {
        response = {
            statusCode: HttpStatus.NOT_FOUND
        };
    } else {
        response = {
            statusCode: HttpStatus.NO_CONTENT
        };
    }

    callback(undefined, response);
};

export { verify };
