import {ParamMetadata} from "./ParamMetadata";
import {ActionMetadataArgs} from "./args/ActionMetadataArgs";
import {ActionType} from "./types/ActionTypes";
import {ControllerMetadata} from "./ControllerMetadata";
import {ResponseHandlerMetadata} from "./ResponseHandleMetadata";
import {ResponseHandlerTypes} from "./types/ResponsePropertyTypes";
import {UseMetadata} from "./UseMetadata";
import {ParamTypes} from "./types/ParamTypes";
import {ClassTransformOptions} from "class-transformer";
import {UseInterceptorMetadata} from "./UseInterceptorMetadata";

export class ActionMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Action's controller.
     */
    controllerMetadata: ControllerMetadata;

    /**
     * Action's instance.
     */
     instance: any;

    /**
     * Action's parameters.
     */
    params: ParamMetadata[];

    /**
     * Action's use metadatas.
     */
    uses: UseMetadata[];

    /**
     * Action's intercepts.
     */
    useInterceptors: UseInterceptorMetadata[];

    /**
     * Action's response handlers.
     */
    responseHandlers: ResponseHandlerMetadata[];

    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Class on which's method this action is attached.
     */
    target: Function;

    /**
     * Object's method that will be executed on this action.
     */
    method: string;

    /**
     * Action type represents http method used for the registered route. Can be one of the value defined in ActionTypes
     * class.
     */
    type: ActionType;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    constructor(controllerMetadata: ControllerMetadata, args: ActionMetadataArgs) {
        this.controllerMetadata = controllerMetadata;
        this.instance = controllerMetadata.instance;
        if (args.route)
            this.route = args.route;
        if (args.target)
            this.target = args.target;
        if (args.method)
            this.method = args.method;
        if (args.type)
            this.type = args.type;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get fullRoute(): string|RegExp {
        if (this.route instanceof RegExp) {
            if (this.controllerMetadata.route) {
                return ActionMetadata.appendBaseRouteToRegexpRoute(this.route as RegExp, this.controllerMetadata.route);
            }
            return this.route;
        }

        let path: string = "";
        if (this.controllerMetadata.route) path += this.controllerMetadata.route;
        if (this.route && typeof this.route === "string") path += this.route;
        return path;
    }
    
    get isJsonTyped(): boolean {
        if (this.jsonResponse)
            return true;
        if (this.textResponse)
            return false;
        return this.controllerMetadata.isJsonTyped;
    }
    
    get contentTypeHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.CONTENT_TYPE);
    }
    
    get locationHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.LOCATION);
    }
    
    get regirectHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.REDIRECT);
    }
    
    get successCodeHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.SUCCESS_CODE);
    }
    
    get emptyResultHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.EMPTY_RESULT_CODE);
    }
    
    get nullResultHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.NULL_RESULT_CODE);
    }
    
    get undefinedResultHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.UNDEFINED_RESULT_CODE);
    }
    
    get errorCodeHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.ERROR_CODE);
    }
    
    get redirectHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.REDIRECT);
    }
    
    get renderedTemplateHandler(): ResponseHandlerMetadata {
        return this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.RENDERED_TEMPLATE);
    }
    
    get headerHandlers(): ResponseHandlerMetadata[] {
        return this.responseHandlers.filter(handler => handler.type === ResponseHandlerTypes.HEADER);
    }

    get responseClassTransformOptions(): ClassTransformOptions {
        const responseHandler = this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.RESPONSE_CLASS_TRANSFORM_OPTIONS);
        if (responseHandler)
            return responseHandler.value;

        return undefined;
    }

    get undefinedResultCode(): number {
        if (this.undefinedResultHandler)
            return this.undefinedResultHandler.value;

        return undefined;
    }

    get nullResultCode(): number {
        if (this.nullResultHandler)
            return this.nullResultHandler.value;
        
        return undefined;
    }
    
    get emptyResultCode(): number {
        if (this.emptyResultHandler)
            return this.emptyResultHandler.value;
        
        return undefined;
    }
    
    get successHttpCode(): number {
        if (this.successCodeHandler)
            return this.successCodeHandler.value;
        
        return undefined;
    }
    
    get headers(): { [name: string]: any } {
        const headers: { [name: string]: any } = {};
        if (this.locationHandler)
            headers["Location"] = this.locationHandler.value;
        
        if (this.contentTypeHandler)
            headers["Content-type"] = this.contentTypeHandler.value;
        
        if (this.headerHandlers)
            this.headerHandlers.map(handler => headers[handler.value] = handler.secondaryValue);
        
        return headers;
    }
    
    get redirect() {
        if (this.redirectHandler)
            return this.redirectHandler.value;

        return undefined;
    }
    
    get renderedTemplate() {
        if (this.renderedTemplateHandler)
            return this.renderedTemplateHandler.value;

        return undefined;
    }
    
    get isCookiesUsed() {
        return !!this.params.find(param => param.type === ParamTypes.COOKIE);
    }
    
    get isBodyUsed() {
        return !!this.params.find(param => param.type === ParamTypes.BODY ||  param.type === ParamTypes.BODY_PARAM);
    }
    
    get isFilesUsed() {
        return !!this.params.find(param => param.type === ParamTypes.UPLOADED_FILES);
    }
    
    get isFileUsed() {
        return !!this.params.find(param => param.type === ParamTypes.UPLOADED_FILE);
    }

    /**
     * If set to true then response will be forced to json (serialized and application/json content-type will be used).
     */
    get jsonResponse(): boolean {
        return !!this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.JSON_RESPONSE);
    }

    /**
     * If set to true then response will be forced to simple string text response.
     */
    get textResponse(): boolean {
        return !!this.responseHandlers.find(handler => handler.type === ResponseHandlerTypes.TEXT_RESPONSE);
    }
    
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    executeAction(params: any[]) {
        return this.instance[this.method].apply(this.instance, params);
    }

    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    
    static appendBaseRouteToRegexpRoute(route: RegExp, baseRoute: string) {
        if (!baseRoute || baseRoute === "") return route;
        const fullPath = baseRoute.replace("\/", "\\\\/") + route.toString().substr(1);
        return new RegExp(fullPath, route.flags);
    }
    
}