import { RootState } from '../../application/store';

export const getSentData = (state: RootState) => state.send.sentData;
