import React from 'react';
import { SvgIcon } from './typings';

export const AttachIcon: React.FC<SvgIcon> = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V8" stroke="url(#paint0_linear_2937_18594)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V8H20M2 15H12M9 18L12 15L9 12" stroke="url(#paint1_linear_2937_18594)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="paint0_linear_2937_18594" x1="4" y1="12.0377" x2="24.6895" y2="12.0377" gradientUnits="userSpaceOnUse">
        <stop offset="0.390081" stopColor="#1768E5" />
        <stop offset="1" stopColor="#00F0FF" />
      </linearGradient>
      <linearGradient id="paint1_linear_2937_18594" x1="2" y1="10.0302" x2="25.2757" y2="10.0302" gradientUnits="userSpaceOnUse">
        <stop offset="0.390081" stopColor="#1768E5" />
        <stop offset="1" stopColor="#00F0FF" />
      </linearGradient>
    </defs>
  </svg>

);
