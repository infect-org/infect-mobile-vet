/**
 * Logs parameter to loggly.com; needed to debug published apps.
 */
export default function log(...content) {

    const url = 'http://logs-01.loggly.com/inputs/03a23b1d-d13f-4747-be6f-3b5bbfb1494a/tag/http/';
    // console.log('Logging disabled');
    console.log(...content);

    return;

    /* global Headers, fetch */
    const headers = new Headers({
        'content-type': 'text/plain',
    });

    // To log all arguments passed, convert them into a string
    let stringifiedContent;
    // Stringification might fail for circular structures; make sure we catch this.
    try {
        stringifiedContent = content.map(contentPart => JSON.stringify(contentPart)).join(', ');
    } catch (err) {
        // Just log first content part (which is the main text) and and the corresponding error
        // message
        stringifiedContent = `${content[0]}; logging failed: ${err.message}`;
    }
    return fetch(
        url,
        {
            headers,
            method: 'POST',
            body: stringifiedContent,
        },
    )
        .then(resp => resp.json())
        .then((response) => {
            if (!response.response || response.response !== 'ok') {
                return Promise.reject(new Error(`Invalid response received from logger
                    ${JSON.stringify(response)}`));
            }
            return response;
        })
        .catch((err) => {
            console.error('Could not log %o, error is %o', content, err);
        });
}
