# TestDashboard
The test dashboard is part of the Sparc Portal and is meant to compare various vagus nerve images. This is v1. Will be migrated and renamed. 

[See LATEST DEMO](https://sparc-app-2-dev-features-2a5a06b8ea5c.herokuapp.com/apps/dashboard)

## Latest Version
    "sparc-dashboard-beta": "^0.4.3",

## Storybook
View the storybook of working components here
https://nih-sparc.github.io/TestDashboard/?path=/docs/components-biolucidaviewer--docs

Live Demo Here
https://sparc-app-2-dev-features-2a5a06b8ea5c.herokuapp.com/apps/dashboard

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) 

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
Yarn install
```

### Compile and Hot-Reload for Development

```sh
Yarn run dev
```

### Type-Check, Compile and Minify for Production

```sh
Yarn run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
Yarn run lint
```

## Dependency Setup

If you are installing this project as a node module [npm](https://www.npmjs.com/package/sparc-dashboard-beta) dependency you need the following installed in your project. 

Vue(^3.5.13)
```sh
yarn add vue
```
Element-Plus(^2.8.4)
```sh
yarn add element-plus
```
### Importing Dashboard into your project

Example main.js

main.js
```
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {installDashboard} from 'sparc-dashboard-beta'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

//add the components you want to be included in your dashboard. This populates the drop down
//name must match what you named your component in [filename].vue
const componentMap = [
    'FlatmapViewer',
    'ImageSelector',
    'BiolucidaViewer',
    'QDBGraph',
    'TextWidget'
]

//pinia is optional, dashboard will initiate a pinia instance if it is excluded
//app and componentMap are required
installDashboard(app, componentMap, pinia);

app.use(ElementPlus);
app.use(pinia);
app.mount('#app');

```
In your vue app.vue or componentName.vue
```
<template>
  <SparcDashboard :dBItems="dashboardItems" :hideHeader="true" :options="dashboardOptions"/>
</template>
<script>
//using this naming convention [componenentName]-n, you can customize the dashboard for it's initial load. 
// -n should start with 0 or 1 and count up one integer at a time
//dbItems is required. If you want the dashboard to be blank, send it an empty array
const dashboardItems = [
    { id: "FlatmapViewer-1", x: 0, y: 0, h: 8, w:2, componentName:"Flatmap Viewer",component:"FlatmapViewer" },
    { id: "ImageSelector-2", x: 2, y: 0, h: 8, w:3, componentName:"Image Selector", component:"ImageSelector"},
    { id: "BiolucidaViewer-3", x: 5, y: 0,h: 11, w:7, componentName:"MBF Viewer", component:"BiolucidaViewer"},
    { id: "ODBGraph-4", x: 0, y: 8, h: 3, w:5, componentName:"Flatmap Viewer",component:"QDBGraph"},
    { id: "TextWidget-1", x: 0, y: 0, h: 1, w:4, componentName:"Text",component:"TextWidget",hideHeader:true, Props:{displayText:"Dataset Overview",hideHeader:true} }
     ]
const dashboardOptions = {
  globalData: {
    FileCount: 10,
    Status: "Published",
    CollaboratorCounts: 8
  }
};
</script>
```
## List of Available Components
- any of these may be imported in the componentMap

BiolucidaViewer - Surfaces Biolucida Images when SELECTED_IMAGE (in global vars) is updated

FlatmapViewer - Shows the vagas flatmap. Updats the FLATMAP_LOCATION global var

ImageSelector - Displays list of images in the global var DASH_IMAGE_ARRAY. Updates SELECTED_IMAGE
QDBGraph - displays QDB data

ScaffoldViewer - Displays 3D Scaffold

TextWidget - Displays text assigned by user or from data

## DashboardItems

How to add to the global variable in the dashboard, so that your widget can have access to them.
globalData is set up as a key value pair. 

```
<template>
  <SparcDashboard :dBItems="dashboardItems" :hideHeader="true" :options="dashboardOptions"/>
</template>
<script>
const dashboardOptions = {
  globalData: {
    FileCount: 10,
    Status: "Published",
    CollaboratorCounts: 8,
    ListOfCollabs: [{name:"jen", id:5},{name:"Bruce",id:23}],
  }
};
</script>
```
It is recomended, but not necissary, that you ensure you are passing reactive data or that the dashboard options are reactive
ex
```
const dashboardOptions = computed(() => ({
  globalData: {
    FileCount: filesCount.value,
    Status: publicationStatus.value,
    CollaboratorCounts: collaboratorCounts.value,
    viewerComponents: [TimeseriesComponent, SlideViewer],
    package:pkg
  }
}));
```

### Props

You can pass key/value pairs to your inital component list. 

*when your component is added by a user, you will need to have a way for them to set what would otherwise be properties. This would intail surfacing the properties through the dashboardOptions > globalData

```
    { id: "TextWidget-1", x: 0, y: 0, h: 1, w:4, componentName:"Text",component:"TextWidget",hideHeader:true, Props:{displayText:"Dataset Overview",hideHeader:true} }
```

is the same as sending a component a property in vue 3. The above code is the functional equivalent as the below code.

```
<script>
    const displayText = "Dataset Overview";
    const noHeader = true;
</script>
<template>
    <custom-component :displayText="displayText" :hideHeader="noHeader"></custom-component>
</template
```
## Dashboard Options

# DOCUMENTATION 
- adding custom component to dashboard

### DESCRIPTION
Custom component that can be added within the dashboard and has the capabilities to interact with other components.


### INSTALLATION
Clone the github repo and navigate to src/components/SampleComponent.vue

Expose Your Custom Component to the Dashboard:
 - Add component tag name to the main.ts document in your project

	src/main.ts or src/main.js
```
const componentMap = [
    'ImageSelector',
    'FlatmapViewer',
    'BiolucidaViewer',
    'QDBGraph'
  ] 
```

Using the component “SampleComponent”, It would look something like this:
```
const componentMap = [
    'ImageSelector',
    'FlatmapViewer',
    'BiolucidaViewer',
    'QDBGraph',
   'SampleComponent'
    ]
```

* component name should align with file name. SampleComponent.vue should be renamed and then that new name should be added in main.ts 

### Template

This is your default template. Customize however you like with html and vue 3 markup. Do not delete the header which is added via the <slot> tag
```
<template>                 
      <!-- slot is for header & user can add icons using childIcons-->
      <slot :widgetName="widgetName" :childIcons="childIcons"></slot>


    <div ref="instance">
        <div class="sample-component">this is a sample component
        <div> 
            <p>more of the component goes here</p>
        </div>
        </div>

    </div>
</template>
```
## Header

### Set Name

This line in your setup script allows you to set the header to your widget name. It does not have to match to file name. 

DEPRICATED FOR NOW
```
    const widgetName = ref('New Custom Component!');//replace with component name you want shown
 ```

DO NOT DELETE SLOT

This is where your default header and icons are set. Do not delete or change the variable name
```
<slot :widgetName="widgetName" :childIcons="childIcons"></slot>
```


you can also set the name in your dBItems object. The user can set the name by clicking on the header and typeing what they want. 

```
 { id: "FlatmapViewer-1", x: 0, y: 0, h: 8, w:2, componentName:"Flatmap Viewer",component:"FlatmapViewer" },
 //componentName will override the default name set from inside the component. 
```

### Set Icons

There are default icons on the header. A download one and a close icon (when in edit mode). 
You can add a custom icon to your widget's header and send it a function. 

Here we are adding a graph icon that when clicked will alert the user. 
js
```
    const childIcons=shallowRef([{"comp":GraphIcon,"event":testIcon}]);
    function testIcon(){alert("test icon function")};
```
html
```
   <slot :widgetName="widgetName" :childIcons="childIcons"></slot>
```
A more practical case will be to open a settings window. Simply have a function that sets your settings visibility to true. See QDBGraph and it's QDBGraphSettings for a working example. 

### PROPERTIES
These are passed down to the your component (SampleComponent) from its wrapper via the props value

```
//properties are passed to your component through Props:{} object. See your specific component's docs for what properties they have. 
const dBItems = [
    {id: "TextWidget-1", x: 0, y: 0, h: 1, w:4, componentName:"Text",component:"TextWidget",Props:{displayText:"Dastaset Overview",hideHeader:true}}
    ]
```


### CUSTOM EMITS/EVENTS:

add your emits to your global pinia instance or create your own store
```
    import {useGlobalVarsStore} from "../stores/globalVars"
    const GlobalVars = useGlobalVarsStore();
```

***Building a custom emit/event***

Use the store as you would any vue project the update or watch global vars

ex: This shows a header that is computed based on if its property key matches the optionsData in the globalVars
```
<template>
      <h2>{{ textContentGV }}</h2>
</template>
<script>
  import {useGlobalVarsStore} from "../stores/globalVars.ts"
    const globalVars = useGlobalVarsStore();

  const textContentGV = computed(() => {
    const optionMatch = globalVars.optionsData.find(item => item.name === props.bindedKey);
    return optionMatch?.value ?? "—"; 
  })
</script>
```

### GLOBAL VARS AND FUNCTIONS

Examples are based off of the globalVar selectedImage.

***setSelectedImage***
- call function when widget has selected an image
Example for use:

```
    const selectedImage = new SparcImageObject(data, packageId);
    GlobalVars.setSelectedImage(selectedImage) 
```
//data variable is returned from the QDB

***SELECTED_IMAGE***

- watch for selected image to update and do something.  
```
    watch(() => GlobalVars.SELECTED_IMAGE, (newVal, oldVal) => {
        ///do something
    })
```
### Changeing Dashboard Styles

The dashboard supports basic theming through CSS custom properties, allowing you to override colors, backgrounds, and other style values from your own application.

To customize styles, define your overrides in a global stylesheet and scope them to the .dashboard-app class:

```
.dashboard-app{
    --dash-text-dark: yellow;
    --dash-background: purple;
  }
```

all available variable can be found in src/assets/vars.scss

-Tip: Make sure your styles are loaded before the dashboard is mounted for overrides to take effect. Import at the top of main.js to insure proper loading.

## Sample Component

Here is an example of the SampleComponent.vue file as of 7/17/2024. See github for latest versions

```
<template>                 
      <!-- slot is for header & user can add icons using childIcons-->
      <slot :widgetName="widgetName" :childIcons="childIcons"></slot>


    <div ref="instance">
        <div class="sample-component">this is a sample component
        <div> 
            <p>more of the component goes here</p>
        </div>
        </div>
        <!-- all markup -->
    </div>
</template>
<script setup>

    import { ref, defineEmits, inject, watch, onMounted, onUnmounted } from 'vue';
    import GraphIcon from './icons/GraphIcon.vue';
    //this is included so that your component does not inherit props or attributes that you do not explicitly declare 
    defineOptions({
        inheritAttrs: false
    })

    const widgetName = ref('New Custom Component!');//replace with component name you want shown
    
    //add icon to header. must import your icon as shown above ex: import GraphIcon from './icons/GraphIcon.vue'
    //this is optional and can be deleted
    const childIcons=shallowRef([{"comp":GraphIcon,"event":testIcon}]);
    function testIcon(){alert("test icon function")};


</script>
<style scoped lang="scss">
//import SPARC styles if you want to have access to them. 


//example of class styles
.sample-component{
    height:500px;
    width:400px;
    border: solid purple 1px;
    background-color: grey;
}
</style>
```

