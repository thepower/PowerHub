const defaultErrorMessage = 'В приложении произошла ошибка. Если она повторится или будет мешать вам работать, обратитесь в службу поддержки.';
export const getErrorMessage = (error: any): string => {
  if (error && error.message) {
    return error.message;
  }

  return defaultErrorMessage;
};
