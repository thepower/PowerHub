import { createSelector } from '@reduxjs/toolkit';
import { dappsListData, nftListData } from 'discover/utils/dappsListData';
import { RootState } from '../../application/store';
import { DiscoverState } from '../slice/discoverSlice';

export const getDiscoverState = (state: RootState) => (
  state.discover
);

export const getCurrentDiscoverTab = createSelector(
  getDiscoverState,
  (state: DiscoverState) => state.currentTab,
);

export const getDappsCardData = (id: string) => (
  dappsListData.find((dappsData) => dappsData.id === id)
);

export const getNftCollectionCardData = (id: string) => (
  nftListData.find((data) => data.id === id)
);
