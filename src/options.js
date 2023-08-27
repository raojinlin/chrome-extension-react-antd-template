import React from 'react';
import ReactDom from 'react-dom/client';


function Options({ }) {
  return (
    <div>
      <a target='_blank' href="https://developer.chrome.com/docs/extensions/mv3/options/">Options page</a>
    </div>
  );
}

function main(container) {
  ReactDom.createRoot(container).render(<Options />);
}


main(document.body.querySelector('#root'));
