declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

// VS Code webview window 객체에 대한 타입 확장
interface Window {
  vscode?: any;
  viewInfo?: {
    viewType: 'sidebar' | 'panel';
    viewId: string;
  };
}
