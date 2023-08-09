import React from 'react';
import { Menu } from "antd";
import { openOptionsPage } from "../../lib/brower";
import Example from '@/components/Example';


export default function Popup({ }) {
  return (
    <div style={{width: '500px'}}>
      <Example />
      <Menu>
        <Menu.Item onClick={openOptionsPage}>打开配置页面</Menu.Item>
      </Menu>
    </div>
  );
}
