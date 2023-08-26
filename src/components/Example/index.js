import React from 'react';
import { Button, Space, message } from 'antd';

const Example = () => {
  const handleClick = React.useCallback(() => {
    message.info("hello");
  }, []);
  return ( 
    <Space wrap>
      <Button onClick={handleClick} type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </Space>
  )
};

export default Example;