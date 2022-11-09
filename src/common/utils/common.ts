export const branchCallFunction = (func: any, fallbackFunction?: any) => {
  if (typeof func === 'function') {
    return func();
  }

  if (fallbackFunction && typeof fallbackFunction === 'function') {
    return fallbackFunction();
  }

  return null;
};
