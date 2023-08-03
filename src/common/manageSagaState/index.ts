import { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'typed-redux-saga';
import { toast } from 'react-toastify';
import { startAction, stopAction } from 'network/slice';
import i18n from 'locales/initTranslation';

const manageSagaState = (saga: any) => (function* (action: PayloadAction<any>) {
  try {
    yield* put(startAction({ name: action.type, params: action.payload }));
    yield* saga(action);
  } catch (err: any) {
    if (err.networkError) {
      toast.error(i18n.t('networkError'));
    } else {
      console.error(err);
    }
  } finally {
    yield* put(stopAction({ name: action.type, params: action.payload }));
  }
});

export default manageSagaState;
