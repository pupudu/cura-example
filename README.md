# Create Universal React App
The intention of this repo is to develop the initial setup for the reactools library 
and to showcase a working prototype of the concept. 

### Getting Started
Currently, the react app and the express server are not integrated properly. Running `npm start`
will build the react app and start the express server.

    $ yarn start
    
Then open localhost:3000 and click on the BEGIN button.
This will 

* Trigger a fetch call
* Bring some data from the backend
* Update the fetch status (first "in-progress", and then "success")
* Set the data to the redux store
* Do a redirection to /someNewPage

All without any code(after the initial setup is done). 
Only need to set some metadata. 
Since there is no code, no need to test anything. No need to mock anything.  

### Concept
The expected outcomes of this are 5 fold,

1. Implement a scalable data fetching approach upon redux with all the goodies
1. All in one solution for SSR, Code-splitting, React Router and Redux
1. Hide webpack to share configs across repos
1. Encourage Domain Driven Design for the frontend
 
While trying to achieve the above goal,

1. Don't force a lock in: users can opt in/out anytime, piece by piece
1. Should support Create React App out of the box
1. Agnostic about the backend
1. Support connected react router 

### TODO

1. Integrate the frontend app with the express server
1. Strip out reactools and reactools-express as npm packages
1. Write tests for the reactools library modules
1. Write end user documentation (specially for the metadata format)
1. Expose a test method to validate users metadata using Json Schema