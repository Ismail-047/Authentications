/**
 * Logs detailed error information to the console, including the context, error message, stack trace, and timestamp.
 *
 * @function consoleError
 * 
 * @param {string} context - The context or module where the error occurred.
 * @param {Error} error - The error object containing the message and stack trace.
 *
 * @returns {void} This function does not return any value, it just logs the error to the console.
 */
export const consoleError = (context, error) => {
   console.error(`
 ------------------------------------------------------------------------
 [ERROR] Internal Server Error in "${context}"
    \nERROR MESSAGE: ${error.message}
    \nERROR STACK: ${error.stack}
 \nTIMESTAMP: ${new Date().toISOString()}
 ------------------------------------------------------------------------
 `);
}

/**
 * Sends a response to the client with the specified status code, message, and data.
 *
 * @function sendRes
 * 
 * @param {Object} res - The response object.
 * @param {number} status - The HTTP status code to send.
 * @param {string} message - The message to send to the client.
 * @param {Object} [data=null] - Optional data to include in the response.
 *
 * @returns {Object} The response object with the specified status code, message, and data.
 */
export const sendRes = (res, status, message, data = null) => {

   const response = { message };
   if (data) response.data = data;

   return res.status(status).json(response);
}


