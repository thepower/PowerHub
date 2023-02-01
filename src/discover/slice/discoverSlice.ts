import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Maybe } from 'typings/common';
import { DiscoverTabs } from '../typings/discoverTypings';

const SLICE_NAME = 'discover';

export type DiscoverState = {
  currentTab: DiscoverTabs;
  currentOpenedDappsId: Maybe<string>;
};

const initialState: DiscoverState = {
  currentTab: DiscoverTabs.Dapps,
  currentOpenedDappsId: null,
};

const discoverSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setCurrentDiscoverTab: (state: DiscoverState, action: PayloadAction<DiscoverTabs>) => {
      state.currentTab = action.payload;
    },
    setCurrentOpenedDappsId: (state: DiscoverState, action: PayloadAction<string>) => {
      state.currentOpenedDappsId = action.payload;
    },
  },
});

const {
  reducer: discoverReducer,
  actions: {
    setCurrentDiscoverTab,
    setCurrentOpenedDappsId,
  },
} = discoverSlice;

export {
  discoverReducer,
  setCurrentDiscoverTab,
  setCurrentOpenedDappsId,
};
