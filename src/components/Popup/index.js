import React from 'react';
import { Menu } from "antd";
import { openOptionsPage } from "../../lib/brower";


export default function Popup({ }) {
  return (
    <Menu>
      <Menu.Item>Item1</Menu.Item>
      <Menu.Item>Item2</Menu.Item>
      <Menu.Item onClick={openOptionsPage}>打开配置页面</Menu.Item>
    </Menu>
  );
}
