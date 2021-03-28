/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable global-require */
import React, { useState } from 'react';
import DataSet from '@antv/data-set';
import { Chart, Line, Point, Tooltip, Legend, Axis, Interval } from 'bizcharts';
import ReactECharts from 'echarts-for-react';
import data from '../../data-2-1.json';

function computeData() {
  const fs = require('fs');
  const path = require('path');

  const Dir = `${__dirname}/page`;
  const SOC_S_Array = fs
    .readFileSync(path.join(Dir, './mathdata/SOC_S.txt'))
    .toString()
    .split(',')
    .map((item: any) => Number(item) || 0);
  const SOC_E_Array = fs
    .readFileSync(path.join(Dir, './mathdata/SOC_E.txt'))
    .toString()
    .split(',')
    .map((item: any) => Number(item) || 0);
  const TIME_START_Array = fs
    .readFileSync(path.join(Dir, './mathdata/TIME_START.txt'))
    .toString()
    .split(',')
    .map((item: any) => Number(item) || 0);
  console.log(SOC_S_Array.length, SOC_E_Array.length, TIME_START_Array.length);
  const data: { year: string; p: any; time: number }[] = [];
  const use_time_map = new Map();
  const use_time_arr = new Array(24).fill(0);
  const P = 4;
  console.time('useTime');
  // 抽取10000个随机起始时间, 对每一个随机起始时间进行模拟
  TIME_START_Array.slice(0, 10000).forEach(
    (TIME_START: number, index: number) => {
      // 随机抽取起始电量
      const SOC_S = SOC_S_Array[index];
      const SOC_E_ES_Array = SOC_E_Array.slice(
        SOC_E_Array.findIndex((item: any) => item >= SOC_S)
      );
      // 随机抽取充电结束电量
      const SOC_E =
        SOC_E_ES_Array[Math.floor(SOC_E_ES_Array.length * Math.random())];
      if (!SOC_E) return;
      // 随机抽取电动车电量
      const W = Math.random() < 0.75 ? 60 : 16;
      // 计算充电消耗时间
      const USE_TIME = (W * (SOC_E - SOC_S)) / P / 100;
      // 计算充电结束时间
      const TIME_END = Math.ceil(TIME_START + USE_TIME);
      const st = Math.floor(TIME_START);
      // 将充电时间段累加到24小时数组
      for (let i = st >= 0 ? st : 23; i <= TIME_END; i++) {
        if (i > 23) {
          use_time_map.set(i - 24, (use_time_map.get(i - 24) || 0) + 1);
          use_time_arr[i - 24]++;
        } else {
          use_time_map.set(i, (use_time_map.get(i) || 0) + 1);
          use_time_arr[i]++;
        }
      }
    }
  );
  console.timeEnd('useTime');
  console.log(Array.from(use_time_map));
  console.log(use_time_arr);
  use_time_arr.forEach((item, index) => {
    const _2018 = item * 4;
    const _2023 = _2018 * 1.05 ** 5;
    const _2028 = _2023 * 1.05 ** 5;
    const _2033 = _2028 * 1.05 ** 5;
    data.push({ year: '2018', p: _2018, time: index });
    data.push({ year: '2023', p: _2023, time: index });
    data.push({ year: '2028', p: _2028, time: index });
    data.push({ year: '2033', p: _2033, time: index });
  });
  return data;
}

const scale = {
  p: { min: 0 },
  year: {
    formatter: (v: string) => {
      return `${v}年`;
    },
  },
  time: {
    max: 23,
    tickInterval: 1,
  },
};

function Demo() {
  // console.time('excute');
  // const data1 = computeData();
  // const fs = require('fs');
  // fs.writeFile(`data-${'2-1'}.json`, JSON.stringify(data1), (err: any) => {
  //   if (err) throw err;
  //   console.log('数据已被追加到文件');
  // });
  // const [data, setData] = useState(data1);

  // const ds = new DataSet();
  // const dv = ds
  //   .createView()
  //   .source(data)
  //   .transform({
  //     type: 'percent',
  //     field: 'p', // 统计销量
  //     dimension: 'country', // 每年的占比
  //     groupBy: ['year'], // 以不同产品类别为分组
  //     as: 'percent',
  //   });
  console.log(data);
  return (
    <div>
      <ReactECharts
        option={{
          padding: {
            top: 30,
          },
          legend: {
            show: true,
            data: ['2018', '2023', '2028', '2033'],
            textStyle: {
              fontSize: 16,
            },
          },
          xAxis: {
            type: 'category',
            name: '时间',
            nameTextStyle: {
              fontSize: 16,
            },
            interval: 2,
            data: new Array(24).fill(1).map((item, index) => {
              return `${index >= 10 ? index : `0${index}`}:00`;
            }),
          },
          yAxis: {
            type: 'value',
            nameTextStyle: {
              fontSize: 16,
            },
            name: '负荷/千瓦时',
          },
          series: [
            ...['2018', '2023', '2028', '2033'].map((year) => {
              return {
                name: year,
                data: data
                  .filter((item) => item.year === year)
                  .map((item) => item.p),
                type: 'line',
                smooth: true,
              };
            }),
            // {
            //   // data: [...data[2]],
            //   data,
            //   type: 'line',
            //   smooth: true,
            // },
          ],
        }}
        style={{ width: '100%', height: '45vh' }}
      />
    </div>
  );
}

export default Demo;
