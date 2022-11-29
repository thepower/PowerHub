import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiscoverTabs } from '../typings/discoverTypings';

const SLICE_NAME = 'discover';

export type DiscoverState = {
  currentTab: DiscoverTabs;
  currentPageNumber: number;
};

const initialState: DiscoverState = {
  currentTab: DiscoverTabs.Dapps,
  currentPageNumber: 0,
};

const discoverSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setCurrentDiscoverTab: (state: DiscoverState, action: PayloadAction<DiscoverTabs>) => {
      state.currentTab = action.payload;
    },
  },
});

const {
  reducer: discoverReducer,
  actions: {
    setCurrentDiscoverTab,
  },
} = discoverSlice;

export {
  discoverReducer,
  setCurrentDiscoverTab,
};
