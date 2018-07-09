/**
 * This is a template for creating an SSR adapter
 * JSDocs against each method of this class will explain the intended use of the methods.
 */

import React from 'react';

class Adapter {

  /**
   * Any initial values that would be shared across the other methods will be declared here.
   * It is recommended to define them here (and bind them to `this` keyword) only if they are shared across the other methods
   */
  constructor() {

  }

  /**
   * Sometimes, the adapters need to be initialized by the users (with adapter specific custom data).
   * For instance, for the redux adapter, the user needs to create the user by themselves and inject it here.
   * This is the place to do such declarations
   */
  init() {

  }

  /**
   * When the adapter is supposed to render something to the root html, this is the place to do that.
   * First the user should define a unique tag in the public/index.html generated by create-react-app (or any other alternative)
   * Then they can configure this method to replace that unique tag with dynamic data before sending the html to the browser
   *
   * For inbuilt adapters like redux, we will mention the expected unique tag in the docs.
   * As of now, the idea is to follow a convention, so that the users doesn't need to refer to the docs all the time.
   *
   * @return {string[]}
   */
  replacer() {
    return [
      // TEXT_IN_HTML in the root html will be replaced by TEXT_TO_SUBSTITUTE during the server rendering process
      'TEXT_IN_HTML', `TEXT_TO_SUBSTITUTE`
    ]
  }

  /**
   * This method is used to define how the App Bundle which will be rendered by the react-dom/server.renderToString is generated.
   * If the adapter needs any providers (similar to the redux Provider), then they can be defined them here.
   * The target is to wrap the children in the expected Provider component
   *
   * @param children - current AppBundle (generated using other adapters)
   * @param {object} req - expressJs request object
   * @param {object} res - expressJs response object
   * @param {function} next - expressJs call to next middleware
   * @return {React.Component} - children wrapped with a custom Provider
   */
  render(children, req, res, next) {
    return children;
  }

  /**
   * The intention of this method is to handle anything that should be done after the react-dom/server.renderToString is called.
   * This is quite handy since the changes to contexts can be tackled down internally inside this instance.
   *
   * For example, if we pass an instance variables to the Provider defined in the render method, then when it is
   * updated by the library, it will be reflected here as well. So we can play with the updated instance variable
   * in this method.
   *
   * If the server rendering process should be skipped after this method call, then we should return false from this method.
   * For example, if we want to handle a redirection, then we don't want to do res.send inside the ssr middleware again.
   * i.e. If you are using the res or next params in the method, that is an indication that you might want to return false
   *
   * @param {object} req - expressJs request object
   * @param {object} res - expressJs response object
   * @param {function} next - expressJs call to next middleware
   * @returns {boolean} - whether or not the server rendering process should continue
   */
  adapterDidMount(req, res, next) {

  }
}

export default new Adapter();