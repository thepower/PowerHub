declare module '@thepowereco/msgpack';

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module '*.module.scss' {
  const styles: { [className: string]: string };
  export default styles;
}
