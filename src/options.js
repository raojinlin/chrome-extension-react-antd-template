import React from 'react';
import ReactDom from 'react-dom/client';
import Options from './components/Options';


function main(container) {
  ReactDom.createRoot(container).render(<Options />);
}


main(document.body.querySelector('#root'));
