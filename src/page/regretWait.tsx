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

const xxx = [
  0.6,
  0.57,
  0.55,
  0.54,
  0.57,
  0.57,
  0.58,
  0.6,
  0.65,
  0.7,
  0.84,
  0.7,
  0.65,
  0.7,
  0.75,
  0.79,
  0.75,
  0.65,
  0.69,
  0.76,
  0.81,
  0.73,
  0.69,
  0.71,
];

const aaa = xxx.map((item, index) => {
  return (item ** 25 * (1 + Math.abs(index - 24))) / 3;
});

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
            name: '等待时间',
            max: 600,
          },
          series: [
            {
              data: data1[2].map((item: any, index: number) => {
                return (item * aaa[index]) / 10;
              }),
              type: 'bar',
              smooth: true,
            },
          ],
        }}
        style={{ width: '100%', height: '45vh' }}
      />
    </Row>
  );
}
