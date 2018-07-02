import importAll from 'import-all.macro';
import combine from './reactools/combineMetadata';

export default combine(importAll.sync('../**/fetchMetadata*'));
