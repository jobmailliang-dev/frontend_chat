/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 缺少类型声明的模块
declare module 'nprogress' {
  const nprogress: {
    start: () => void;
    done: () => void;
    configure: (options: { showSpinner?: boolean }) => void;
  };
  export default nprogress;
}

declare module 'vue-virtual-scroller' {
  import { Component, App } from 'vue';
  const VueVirtualScroller: Component & {
    install(app: App): void;
  };
  export default VueVirtualScroller;
}
