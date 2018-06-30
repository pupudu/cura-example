import React from 'react';

export default (props) => (
  <div>
    <h1>{props.data ? props.data.message : ""}</h1>
  </div>
);