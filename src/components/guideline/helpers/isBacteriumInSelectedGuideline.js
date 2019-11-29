
/**
 * Check if a bacterium is in current selected guideline/diagnosis
 *
 * @param {Bacterium} bacterium
 * @param {Diagnosis} diagnosis
 * @returns {Boolean}
 */
export default (bacterium, diagnosis) => (diagnosis ?
    diagnosis.inducingBacteria.includes(bacterium) : false);
