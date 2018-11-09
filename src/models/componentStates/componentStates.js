/**
 * Exports all valid component states. Those need to be numbers so we can handle their order
 * (see highestComponentStates) in ComponentStatesModel
 * @type {Number}
 */
export default Object.freeze({
    loading: 10,
    rendering: 20,
    ready: 30,
});
