import { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'typed-redux-saga';
import { toast } from 'react-toastify';
import { startAction, stopAction } from 'network/slice';
import { t } from 'i18next';

const manageSagaState = (saga: any) => (function* (action: PayloadAction<any>) {
  try {
    yield* put(startAction({ name: action.type, params: action.payload }));
    yield* saga(action);
  } catch (err: any) {
    if (err.networkError) {
      toast.error(t('networkError'));
    } else {
      console.error(err);
    }
  } finally {
    yield* put(stopAction({ name: action.type, params: action.payload }));
  }
});

export default manageSagaState;
