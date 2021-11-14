import React from 'react';
import ReactDom from 'react-dom';


function Options({ }) {
  return (
    <div>
      <a target='_blank' href="https://developer.chrome.com/docs/extensions/mv3/options/">Options page</a>
    </div>
  );
}

function main(container) {
  ReactDom.render(<Options />, container);
}


main(document.body.querySelector('#root'));
