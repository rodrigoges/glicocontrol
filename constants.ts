
import { Classification } from './types';

export const CLASSIFICATION_STYLES: { [key in Classification]: string } = {
  [Classification.HYPOGLYCEMIA]: 'bg-blue-100 text-blue-800 ring-blue-200',
  [Classification.NORMAL]: 'bg-green-100 text-green-800 ring-green-200',
  [Classification.HYPERGLYCEMIA]: 'bg-red-100 text-red-800 ring-red-200',
  [Classification.UNCLASSIFIED]: 'bg-gray-100 text-gray-800 ring-gray-200',
};

export const CLASSIFICATION_NAMES: { [key in Classification]: string } = {
    [Classification.HYPOGLYCEMIA]: 'Hipoglicemia',
    [Classification.NORMAL]: 'Normal',
    [Classification.HYPERGLYCEMIA]: 'Hiperglicemia',
    [Classification.UNCLASSIFIED]: 'Não Classificado',
};
