/* eslint-disable prefer-destructuring */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import 'echarts-gl';
import { Button, Row, Col } from 'antd';
import data1 from './data';

const data = [56764, 149971, 237351, 331294, 516396];

const year = [2015, 2016, 2017, 2018, 2019];

export default function Dijkstra() {
  return (
    <Row>
      <ReactECharts
        option={{
          xAxis: {
            name: '年份/年',
            data: year,
          },
          yAxis: {
            name: '中国公共充电桩保有量/台',
          },
          series: [
            {
              data,
              type: 'bar',
              smooth: true,
              label: {
                show: true,
                position: 'top',
              },
            },
          ],
        }}
        style={{ width: '100%', height: '45vh' }}
      />
    </Row>
  );
}
