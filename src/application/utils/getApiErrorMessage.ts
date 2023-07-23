import { t } from 'i18next';

const defaultErrorMessage = t('defaultErrorMessage');
export const getErrorMessage = (error: any): string => {
  if (error && error.message) {
    return error.message;
  }

  return defaultErrorMessage;
};
