// import { EvmCore, EvmContract } from '../evm-api/evmCore';
// import { AddressApi } from '../index';
// import { AccountKey } from '../../typings';

import {
  AccountKey, AddressApi, EvmContract, EvmCore,
} from '@thepowereco/tssdk';

const defaultABI = JSON.parse(
  // eslint-disable-next-line max-len
  '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
);
/*
export enum typeErcToken {
  Erc20,
  NFT
}
*/
export class Evm20Contract {
  private evmContract: EvmContract;

  private key: AccountKey;

  //  private type:typeErcToken;
  private abi: any;
  //  private address:string;

  //  constructor(evmContract: EvmContract,address:string,type:typeErcToken, ABI:string) {
  constructor(evmContract: EvmContract, key: AccountKey, ABI?: any) {
    this.evmContract = evmContract;
    this.key = key;
    this.abi = ABI || defaultABI;
    //    this.type=type;
    //    this.address=address;
  }

  public async build(address: string, evmc: EvmCore, key: AccountKey, ABI?: any): Promise<Evm20Contract> {
    const evmContract = await EvmContract.build(evmc, address, ABI);

    //    return new ErcToken(evmContract, address,type, ABI);
    return new Evm20Contract(evmContract, key, ABI);
  }

  public async getName(): Promise<string> {
    const name = await this.evmContract.scGet('name', []);
    return name;
  }

  public async getDecimals(): Promise<number> {
    const decimals = await this.evmContract.scGet('decimals', []);
    return decimals;
  }

  public async getBalance(owner: string): Promise<bigint> {
    const balanceOf = await this.evmContract.scGet('balanceOf', [AddressApi.textAddressToEvmAddress(owner)]);
    return balanceOf;
  }

  public async getAllowance(owner: string, spender: string): Promise<bigint> {
    const allowance = await this.evmContract.scGet('allowance', [
      AddressApi.textAddressToEvmAddress(owner),
      AddressApi.textAddressToEvmAddress(spender),
    ]);
    return allowance;
  }

  public async transfer(to: string, amount: bigint) {
    return this.evmContract.scSet(this.key, 'transfer', [AddressApi.textAddressToEvmAddress(to), amount]);
  }

  public async transferFrom(from: string, to: string, amount: bigint) {
    return this.evmContract.scSet(this.key, 'transferFrom', [
      AddressApi.textAddressToEvmAddress(from),
      AddressApi.textAddressToEvmAddress(to),
      amount,
    ]);
  }

  public async setApprove(spender: string, value: bigint) {
    return this.evmContract.scSet(this.key, 'approve', [AddressApi.textAddressToEvmAddress(spender), value]);
  }
}
