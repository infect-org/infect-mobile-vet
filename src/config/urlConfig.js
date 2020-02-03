export default Object.freeze({
    baseURL: 'beta.infect.info',
    endpoints: {
        tenant: {
            prefix: 'tenant/v1',
            paths: {
                config: 'config',
            },
        },
        coreData: {
            prefix: 'core-data/v1',
            paths: {
                bacteria: 'pathogen.bacterium',
                antibiotics: 'substance.compound',
                regions: 'generics.region',
                substanceClasses: 'substance.substanceClass',
                ageGroups: 'generics.ageGroup',
                hospitalStatus: 'generics.hospitalStatus',
                animals: 'generics.animal',
            },
        },
        rda: {
            prefix: 'rda/v2',
            paths: {
                data: 'rda.data',
                counter: 'rda.configuration',
            },
        },
        guideline: {
            prefix: 'guideline/v1',
            paths: {
                diagnosisClass: 'diagnosisClass',
                diagnosisBacteria: 'diagnosis_bacterium',
                diagnoses: 'diagnosis',
                guidelines: 'guideline',
                therapies: 'therapy',
                therapyPriorities: 'therapyPriority',
                therapyCompounds: 'therapy_compound',
            },
        },
    },
});
