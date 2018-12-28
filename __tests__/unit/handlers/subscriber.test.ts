import { verify } from '../../../src/handlers/subscriber';

describe('notifications handler', () => {
    const SUBSCRIBER_VERIFICATION_CODE_ORIGINAL = process.env.SUBSCRIBER_VERIFICATION_CODE;
    const SUBSCRIBER_VERIFICATION_CODE_NEW = 'abcdefghijklmnopqrstvwxyz';

    beforeAll(() => {
        process.env.SUBSCRIBER_VERIFICATION_CODE = SUBSCRIBER_VERIFICATION_CODE_NEW;
    });

    afterAll(() => {
        process.env.SUBSCRIBER_VERIFICATION_CODE = SUBSCRIBER_VERIFICATION_CODE_ORIGINAL;
    });

    test('should return 204 given validation code is valid', () => {
        const event = {
            queryStringParameters: {
                verify: SUBSCRIBER_VERIFICATION_CODE_NEW
            }
        };

        // @ts-ignore
        verify(event, null, (error: any, response: any) => {
            expect(response.statusCode).toEqual(204);
        });
    });

    test('should return 404 given validation codes not equal', () => {
        const event = {
            queryStringParameters: {
                verify: '12345678'
            }
        };

        // @ts-ignore
        verify(event, null, (error: any, response: any) => {
            expect(response.statusCode).toEqual(404);
        });
    });

    test('should return 404 given validation code not sent in querystring parameters', () => {
        const event = {
            queryStringParameters: {}
        };

        // @ts-ignore
        verify(event, null, (error: any, response: any) => {
            expect(response.statusCode).toEqual(404);
        });
    });
});
