import { createSelector } from '@reduxjs/toolkit';
import { dappsListData } from 'discover/utils/dappsListData';
import { RootState } from '../../application/store';
import { DiscoverState } from '../slice/discoverSlice';

export const getDiscoverState = (state: RootState) => (
  state.discover
);

export const getCurrentDiscoverTab = createSelector(
  getDiscoverState,
  (state: DiscoverState) => state.currentTab,
);

export const getCurrentDiscoverPage = createSelector(
  getDiscoverState,
  (state: DiscoverState) => state.currentPageNumber,
);

export const getDappsCardData = (id: string) => (
  dappsListData.find((dappsData) => dappsData.id === id)
);
