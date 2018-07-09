import React from 'react';

function onClick(props) {
  props.updateMessage({some: "data"})
    .then(()=>{
      // Do something if needed
    })
}

export default (props) => {
  return <button onClick={()=>onClick(props)}>BEGIN</button>;
};
