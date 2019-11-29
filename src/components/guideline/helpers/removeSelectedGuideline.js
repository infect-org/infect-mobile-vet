import { transaction } from 'mobx';
import guidelineFilter from '../../../models/guideline/guidelineFilter.js';

/**
 * Removes the selected Guideline:
 * - Remove all bacteria & antibiotic filters induced by selected guideline
 * - Deselect the current diagnosis
 */
export default (guidelines, filterTypes, filterValues, selectedFilters) => {
    const diagnosis = guidelines.getSelectedDiagnosis();

    if (diagnosis) {
        const bacteriumNames = diagnosis.inducingBacteria
            .map(bacterium => bacterium.name);

        const antibioticNames = diagnosis.therapies
            .map(therapy => therapy.recommendedAntibiotics)
            .reduce((accumulator, value) => accumulator.concat(value), [])
            .map(recommendedAntibiotic => recommendedAntibiotic.antibiotic.name);

        // We need to do it in a transaction, so all the filters get rendered properly
        transaction(() => {
            filterValues
                .getValuesForProperty(filterTypes.bacterium, 'name')
                .filter(item => bacteriumNames.includes(item.value))
                .forEach(bacteriumFilter => selectedFilters
                    .removeFilter(bacteriumFilter));
            filterValues
                .getValuesForProperty(filterTypes.antibiotic, 'name')
                .filter(item => antibioticNames.includes(item.value))
                .forEach(antibioticFilter => selectedFilters
                    .removeFilter(antibioticFilter));
        });

        // remove «only show relevant data»-guideline-filter
        selectedFilters.removeFilter(guidelineFilter);

        guidelines.selectedGuideline.selectDiagnosis();
    }
};
