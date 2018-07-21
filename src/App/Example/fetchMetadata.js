export default {
  exampleKey2: {
    url: '/exampleEndpoint', // API endpoint
    options: {
      method: 'GET'
      // Can have default headers and params here
    },
    replies: {
      200: [
        {
          type: 'SET_ITEMS', // Set fetched data to default reducer
          setKey: 'exampleKey'
        },
        {
          type: 'REDIRECT', // Do a redirection on success
          url: 'someNewPage'
        }
      ]
    },
    auth: true // Custom attribute to pass the token to API
  }
};
