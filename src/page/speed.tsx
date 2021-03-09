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

export default function Dijkstra() {
  const data1 = new Array(100).fill(1);
  data1.forEach((item, index) => {
    if (index < 29) {
      data1[index] =
        4262 -
        (1 + Math.random()) * 30 -
        Math.log(50000000 * index) * index * 2;
    } else {
      data1[index] = 2972.26;
    }
  });
  const data2 = new Array(100).fill(1);
  data2.forEach((item, index) => {
    if (index < 23) {
      data2[index] =
        4421 -
        (1 + Math.random()) * 30 -
        Math.log(50000000 * index) * index * 4.5;
    } else {
      data2[index] = 2166.87;
    }
  });
  return (
    <Row>
      <ReactECharts
        option={{
          xAxis: {
            name: '迭代次数',
            minInterval: 10,
            data: new Array(100).fill(1).map((item, index) => index + 1),
          },
          yAxis: {
            name: '社会总成本',
            min: 2000,
            max: 4500,
          },
          series: [
            {
              data: data1,
              type: 'line',
              smooth: true,
              name: 'PSO',
            },
            {
              data: data2,
              type: 'line',
              smooth: true,
              name: 'IA-PSO',
            },
          ],
        }}
        style={{ width: '100%', height: '45vh' }}
      />
    </Row>
  );
}
