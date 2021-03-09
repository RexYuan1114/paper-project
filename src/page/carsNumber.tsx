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

const data = [657, 1128, 2191, 3379, 5614, 7932, 10213, 11976, 12853, 13482];

const year = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function Dijkstra() {
  return (
    <Row>
      <ReactECharts
        option={{
          xAxis: {
            name: '年份',
            data: year,
          },
          yAxis: {
            name: '电动汽车保有量',
          },
          series: [
            {
              data,
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
