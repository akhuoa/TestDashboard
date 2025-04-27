/** @type { import('@storybook/vue3').Preview } */
import { setup } from '@storybook/vue3'
import { defineAsyncComponent } from 'vue'
import DesignSystemComponentsPlugin from 'sparc-design-system-components-2'
import 'element-plus/dist/index.css';
import sparcTheme from './sparcTheme'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia';
import { GridStack } from 'gridstack';
import { useGlobalVarsStore } from '../src/stores/globalVars.ts'
import "../dist/output.css"
import {Dataset} from '../src/assets/Model';

const componentMap = [
  'ImageSelector',
  'FlatmapViewer',
]

const pinia = createPinia();



const viewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      height: '812px',
      width: '375px'
    },
    type: 'mobile'
  },
  tablet: {
    name: 'Tablet',
    styles: {
      height: '1024px',
      width: '768px'
    },
    type: 'tablet'
  },
  desktop: {
    name: 'Desktop',
    styles: {
      height: '800px',
      width: '1280px'
    },
    type: 'desktop'
  },
  largeDisplay: {
    name: 'Large Display',
    styles: {
      height: '1080px',
      width: '1920px'
    },
    type: 'desktop'
  },
};

const preview = {
  
  parameters: {
    viewport: {
      viewports
    },
    options:{
      theme: sparcTheme,
          storySort: (a, b) =>
       a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true })
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      components: {
        table: null,
      }
    }
  }
};


setup((app)=>{
  app.use(DesignSystemComponentsPlugin);
  app.use(ElementPlus);
  app.use(pinia);


  componentMap.forEach(comp=>{
    const asyncComponent = defineAsyncComponent(() => import(`../src/components/${comp}.vue`)); 
    app.component(comp, asyncComponent);
  })
  
  const globalVars = useGlobalVarsStore();
  globalVars.componentList = componentMap;
  
})
export default preview;
