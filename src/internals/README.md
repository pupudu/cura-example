# Internals
The main module here is the store. This is for creating the redux store. 
This is a typical store creator in redux.

The rootSaga is for starting our fetch saga. 
We can start any other sagas as required as well.
Preprocessors can be defined here but is not vital. 
They can be defined anywhere in the app. 

The rootMetadata is for assembling all the fetchMetadata modules.
This can be done manually or using the combineMetadata module in reactools.
The combineMetadata module is experimental and may not be stable.

The root reducer is a typical root reducer for redux. 
