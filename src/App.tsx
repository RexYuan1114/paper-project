import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.global.css';
import { Button, Menu, Row, Col } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import Private from './page/private';
import DijkstraGraph from './page/dijkstraGraph';

const { SubMenu } = Menu;

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
const handleClick = (e: any) => {
  console.log('click ', e);
};
export default function App2() {
  return (
    <Router>
      <div style={{ height: '100vh', width: '100vw', background: '#fff' }}>
        <Row gutter={20} wrap={false}>
          <Col flex="128px">
            <Menu
              onClick={handleClick}
              style={{ width: 128 }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              // mode="inline"
            >
              <Menu.Item key="1">
                <Link to="/a">分布图</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/DijkstraGraph">DijkstraGraph</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col flex="auto">
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/a">
                <Private />
              </Route>
              <Route path="/DijkstraGraph">
                <DijkstraGraph />
              </Route>
              <Route path="/" extra>
                <DijkstraGraph />
              </Route>
            </Switch>
          </Col>
        </Row>
      </div>
    </Router>
  );
}
