import React from 'react';
import Popup from "./components/Popup";
import ReactDom from 'react-dom';


function main(container) {
  ReactDom.render(<Popup />, container);
}

main(document.body.querySelector('#root'));
