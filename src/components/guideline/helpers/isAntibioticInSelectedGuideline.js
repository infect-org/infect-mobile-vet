
/**
 * Check if an antibiotic is in current selected guideline/diagnosis/therapy
 *
 * @param {Antibiotic} antibiotic
 * @param {Diagnosis} diagnosis
 * @returns {Boolean}
 */
export default (antibiotic, diagnosis) => (diagnosis ?
    diagnosis.getTherapiesForAntibiotic(antibiotic).length > 0 : false);
