import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.global.css';
import { Button, Menu, Row, Col } from 'antd';
import 'echarts-gl';
import Private from './page/private';
import Noregret from './page/noregret';
import NoregretWait from './page/noregretWait';
import Regret from './page/regret';
import RegretWait from './page/regretWait';
import Total from './page/total';

const { SubMenu } = Menu;

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
                <Link to="/a">基于蒙特卡洛方法预测充电汽车负荷的时间分布</Link>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title="考虑用户后悔度的公共区域电动汽车负荷预测"
              >
                <Menu.ItemGroup key="g1" title="不考虑用户后悔度">
                  <Menu.Item key="2">
                    <Link to="/Noregret">充电需求负荷时空分布</Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/NoregretWait">充电平均等待时间</Link>
                  </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="g2" title="考虑用户后悔度">
                  <Menu.Item key="4">
                    <Link to="/Regret">充电需求负荷时空分布</Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to="/RegretWait">充电平均等待时间</Link>
                  </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="g4" title="公共区域电动汽车负荷时空分布图">
                  <Menu.Item key="6">
                    <Link to="/Total">充电总负荷时间分布图</Link>
                  </Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <SubMenu key="sub3" title="粒子群优化">
                <Menu.Item key="7" disabled>
                  <Link to="/PSO">标准粒子群优化</Link>
                </Menu.Item>
                <Menu.Item key="8" disabled>
                  <Link to="/IA-PSO">免疫粒子群优化</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Col>
          <Col flex="auto">
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/a">
                <Private />
              </Route>
              <Route path="/Noregret">
                <Noregret />
              </Route>
              <Route path="/Regret">
                <Regret />
              </Route>
              <Route path="/NoregretWait">
                <NoregretWait />
              </Route>
              <Route path="/RegretWait">
                <RegretWait />
              </Route>
              <Route path="/Total">
                <Total />
              </Route>
              <Route path="/PSO">
                <Total />
              </Route>
              <Route path="/IA-PSO">
                <Total />
              </Route>
              <Route path="/" extra>
                <Noregret />
              </Route>
            </Switch>
          </Col>
        </Row>
      </div>
    </Router>
  );
}
