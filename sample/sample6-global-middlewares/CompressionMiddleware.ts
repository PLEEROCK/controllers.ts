import {ServerResponse, ServerRequest} from "http";
import {GlobalMiddleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@GlobalMiddleware()
export class CompressionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("hello compression ...");
        next();
    }
    
}