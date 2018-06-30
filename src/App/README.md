# App
This directory represents a single domain of the business.
Each subdirectory inside this directory represents a sub domain of the business.
Each subdirectory will be a self contained package of a component. 

### Package structure
Each package in the application will contain files with a dedicated concern.

1. View: For defining the react component. Must not contain any redux logic.
1. Container: For connecting the view to the redux store. (optional)
1. reducer: Usually, the actions dispatched by the view only impact the same view. In this case, this reducer will handle such actions. Any other reducers can be kept in the root of the App. 
1. FetchMetadata: Metadata for all fetch actions fired by the view will be defined here. 
1. index: Expose a suitable module. By using this, we can change any component to a container and vice-versa wihtout affecting the rest of the application.

The index module can also be used to define the react-loadable logic where it makes sense.
This is optional as sometimes we need to define the loadable logic inside a component. 

Most of the times, a module will import only its submodules. 
If needed otherwise, this is a hint that the component should be in a shared package like HUI.
Or else, these modules can be defined in a shared components directory. However such practice is highly discouraged. 

### Why?
Following this convention encourages the developers to think in DDD. 
Also, we can start as a monolithic react app and strip off a domain later very easily without affecting other domains. 