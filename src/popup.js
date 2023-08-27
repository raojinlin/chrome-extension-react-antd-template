import React from 'react';
import Popup from "./components/Popup";
import ReactDom from 'react-dom/client';


function main(container) {
  ReactDom.createRoot(container).render(<Popup />);
}

main(document.body.querySelector('#root'));
