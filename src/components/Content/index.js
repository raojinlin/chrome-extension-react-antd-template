import React from "react";
import Example from "../Example";

import { getURL } from "../../lib/brower";
import styles from './index.less';


export default function Content({ }) {
  return (
    <div className={styles.content}>
      <div className={styles.icon}>
        <img src={getURL('images/chrome-icon.png')} style={{width: 50}} />
      </div>
      <Example />
    </div>
  );
}
