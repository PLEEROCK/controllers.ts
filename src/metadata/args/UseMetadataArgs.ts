/**
 * Metadata used to store registered middlewares.
 */
export interface UseMetadataArgs {
  /**
   * Indicates if middleware must be executed after routing action is executed.
   */
  afterAction: boolean;

  /**
   * Method to which this "use" is applied.
   * If method is not given it means "use" is used on the controller. Then "use" applied to all controller's actions.
   */
  method?: string;

  /**
   * Middleware to be executed for this "use".
   */
  middleware: Function;

  /**
   * Object class of this "use".
   */
  target: Function;
}
