import React from 'react';
import ReactDom from 'react-dom/client';
import Popup from "./components/Popup";


function main(container) {
  ReactDom.createRoot(container).render(<Popup />);
}

main(document.body.querySelector('#root'));
