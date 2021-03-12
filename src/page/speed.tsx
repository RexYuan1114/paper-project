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
import { NONAME } from 'dns';

export default function Dijkstra() {
  const data1 = new Array(100).fill(1);
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;
  data1.forEach((item, index) => {
    if (index < 29) {
      count1 +=
        (Math.log(5 * (29 - index / 2)) * (29 - index)) / 3 +
        (1 + Math.random()) * 5;
      data1[index] = 4262 - count1 * 1.7;
      console.log(count1);
    } else {
      count3 += Math.random() * 10;
      data1[index] = 2972.26;
      if (index === 29) {
        const temp = data1[29] - data1[28];
        for (let i = 0; i < 29; i += 1) {
          data1[i] += temp;
        }
      }
    }
  });
  data1[26] = data1[25] / 2 + data1[27] / 2;
  const data2 = new Array(100).fill(1);
  data2.forEach((item, index) => {
    if (index < 23) {
      count2 +=
        (Math.log(5 * (29 - index / 2)) * (29 - index)) / 3 +
        (1 + Math.random()) * 5;
      data2[index] = 4421 - count2 * 3.5;
    } else {
      data2[index] = 2166.87;

      if (index === 23) {
        const temp = data2[23] - data2[22];
        for (let i = 0; i < 23; i += 1) {
          data2[i] += temp;
        }
      }
    }
  });

  data1[20] = data1[19] / 2 + data1[21] / 2;
  console.log(data1, data2);
  return (
    <Row>
      <ReactECharts
        option={{
          xAxis: {
            name: '迭代次数',
            data: new Array(100)
              .fill(1)
              .map((item, index) => index + 1)
              .filter((item, index) => index % 2)
              .filter((item, index) => index % 2),
            // axisTick: {
            //   interval: 0,
            // },
          },
          yAxis: {
            name: '社会总成本',
            min: 1500,
          },
          series: [
            {
              data: data1
                .filter((item, index) => index % 2)
                .filter((item, index) => index % 2),
              type: 'line',
              smooth: true,
              symbol: 'none',
              name: 'PSO',
            },
            {
              data: data2
                .filter((item, index) => index % 2)
                .filter((item, index) => index % 2),
              type: 'line',
              symbol: 'none',
              smooth: true,
              name: 'IA-PSO',
            },
          ],
        }}
        style={{ width: '100%', height: '80vh' }}
      />
    </Row>
  );
}
