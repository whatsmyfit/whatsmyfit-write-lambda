import { Callback, Context, Handler } from 'aws-lambda';

interface ISubscriberVerifyResponse {
    statusCode: number;
}

interface ISubscriberVerifyRequestParams {
    verify: string;
}

const verify: Handler = (event: any, context: Context, callback: Callback) => {
    let response: ISubscriberVerifyResponse;

    const validationCode = process.env.SUBSCRIBER_VERIFICATION_CODE;
    const queryStringParameters: ISubscriberVerifyRequestParams = event.queryStringParameters as ISubscriberVerifyRequestParams;

    if (!queryStringParameters || !queryStringParameters.verify || queryStringParameters.verify !== validationCode) {
        response = {
            statusCode: 404
        };
    } else {
        response = {
            statusCode: 204
        };
    }
    callback(undefined, response);
};

export { verify };
