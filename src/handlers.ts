import { Callback, Context, Handler } from "aws-lambda";

interface IHelloResponse {
    statusCode: number;
    body: string;
}

const hello: Handler = (event: any, context: Context, callback: Callback) => {
    const response: IHelloResponse = {
        body: JSON.stringify({
            message: Math.floor(Math.random() * 10),
        }),
        statusCode: 200,
    };

    callback(undefined, response);
};

export { hello };
