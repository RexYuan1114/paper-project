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
import data from './data';

export default function Dijkstra() {
  return (
    <Row>
      <ReactECharts
        option={{
          xAxis: {
            type: 'category',
            name: '时间',
            data: new Array(24).fill(1).map((item, index) => {
              return `${index >= 10 ? index : `0${index}`}:00`;
            }),
          },
          yAxis: {
            type: 'value',
            min: 20000,
            name: '负荷/千瓦时',
          },
          series: [
            {
              data: [...data[2]],
              type: 'line',
              smooth: true,
            },
          ],
        }}
        style={{ width: '100%', height: '45vh' }}
      />
    </Row>
  );
}
