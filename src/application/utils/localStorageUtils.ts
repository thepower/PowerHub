import localForage from 'localforage';

type ApplicationStorageKeyType = 'address' | 'wif' | 'scapps' | 'tokens';

const applicationStorage = localForage.createInstance({
  driver: localForage.LOCALSTORAGE,
  name: 'thepowereco',
  version: 1.0,
});

export const getKeyFromApplicationStorage = (key: ApplicationStorageKeyType) => applicationStorage.getItem(key);
export const setKeyToApplicationStorage = (key: ApplicationStorageKeyType, value: any) => applicationStorage.setItem(key, value);
export const clearApplicationStorage = () => applicationStorage.clear();
