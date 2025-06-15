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


