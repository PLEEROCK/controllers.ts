import {ParamType} from "../metadata/ParamMetadata";
import {ResultHandleOptions} from "./../ResultHandleOptions";

/**
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export interface Server {

    /**
     * Registers action in the server framework.
     *
     * @param route URI path to be registered (for example /users/:id/photos)
     * @param actionType HTTP action to be performed on registered path (GET, POST, etc.)
     * @param executeCallback Function to be called when request comes on the given route with the given action
     */
    registerAction(route: string | RegExp, actionType: string, executeCallback: (request: any, response: any, next?: any) => any): void;

    /**
     * Registers middleware in the server framework.
     *
     * @param route URI path to be registered (for example /users/:id/photos)
     * @param actionType HTTP action to be performed on registered path (GET, POST, etc.)
     * @param executeCallback Function to be called when request comes on the given route with the given action
     */
    registerMiddleware(route: string | RegExp, executeCallback: (request: any, response: any, next?: any) => any): void;
    /**
     * Gets param from the request.
     *
     * @param request Request made by a user
     * @param paramName Parameter name
     * @param paramType Parameter type
     */
    getParamFromRequest(request: any, paramName: string, paramType: ParamType): void;

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     *
     * @param options Handling performs on these options
     */
    handleError(options: ResultHandleOptions): void;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     *
     * @param options Handling performs on these options
     */
    handleSuccess(options: ResultHandleOptions): void;

}
