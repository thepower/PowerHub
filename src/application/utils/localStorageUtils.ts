import { isWallet } from 'application/components/AppRoutes';
import localForage from 'localforage';

type ApplicationStorageKeyType = 'address' | 'wif' | 'scapps' | 'allowedAutoSignTxContractsAddresses';

const applicationStorage = localForage.createInstance({
  driver: localForage.LOCALSTORAGE,
  name: 'thepowereco',
  version: 1.0,
});

export const getKeyFromApplicationStorage = <T>(key: ApplicationStorageKeyType) => applicationStorage.getItem<T>(key);
export const setKeyToApplicationStorage = (key: ApplicationStorageKeyType, value: any) => applicationStorage.setItem(key, value);
export const clearApplicationStorage = async () => {
  if (isWallet) {
    await applicationStorage.removeItem('address');
    await applicationStorage.removeItem('wif');
    await applicationStorage.removeItem('allowedAutoSignTxContractsAddresses');
  } else {
    await applicationStorage.removeItem('address');
  }
};
