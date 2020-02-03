import { Constants } from 'expo';

import urlConfig from './urlConfig.js';

/**
 * Returns the URL for a given scope (e.g. "tenant") and endpoint (e.g. "config")
 * @param {string} scope
 * @param {string} endpoint
 * @return {string} URL for given scope/endpoint
 */
export default function getURL(scope, endpoint) {

    const apiURL = `api.${urlConfig.baseURL}`;

    const scopeData = urlConfig.endpoints[scope];
    if (!scopeData) {
        throw new Error(`getURL: Scope ${scope} is not known. Provide any of ${Object.keys(urlConfig.endpoints).join(', ')}.`);
    }

    if (!scopeData.paths[endpoint]) {
        throw new Error(`getURL: Endpoint ${endpoint} is not known. Provide any of ${Object.keys(scopeData.paths).join(', ')} for scope ${scope}.`);
    }

    // Add filters for preview etc.
    let filter = '';

    // If the releaseChannel is «testing», also load guideline data that has not yet
    // ben published. See https://github.com/infect-org/issues/issues/47.
    if (scope === 'guidelines' && Constants.manifest.releaseChannel === 'testing') {
        filter += '?showAllData=true';
    }

    return `https://${apiURL}/${scopeData.prefix}/${scopeData.paths[endpoint]}${filter}`;
}
