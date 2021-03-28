/* eslint-disable prefer-destructuring */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button, Row, Col } from 'antd';
import Graph from '../../doc/dijkstra';
import roadNet from '../../doc/roadNetData';
import option from './3dchartsOption';
import data10000 from './data';
console.log(JSON.stringify(roadNet));
const SOC_S_P_MAP = [2.3, 9.3, 15.3, 17.5, 16.5, 14.2, 9.7, 7.5, 4, 3.7];
const SOC_E_P_MAP = [0, 0.1, 2, 2.2, 5.5, 7.1, 9, 17.5, 27.8, 28];
const graph = new Graph(roadNet.nodeMap);
function generateSocSArray() {
  const randomNum = Math.random() * 100;
  let count = 0;
  let index = 0;
  SOC_S_P_MAP.forEach((item, subIndex) => {
    const precount = count;
    count += item;
    if (randomNum - count <= 0.00001 && randomNum - precount >= 0.00001) {
      index = subIndex;
    }
  });
  return index * 10 + Math.random() * 10;
}
function generateSocE(SOC_S: number) {
  let count = 0;
  let totalCount = 0;
  let index = 0;
  const tempArr = SOC_E_P_MAP.filter(
    (item, subIndex) => subIndex >= Math.ceil(SOC_S / 10)
  );
  tempArr.forEach((item) => {
    totalCount += item;
  });
  const randomNum = Math.random() * totalCount;
  tempArr.forEach((item, subIndex) => {
    const precount = count;
    count += item;
    if (randomNum - count <= 0.00001 && randomNum - precount >= 0.00001) {
      index = subIndex;
    }
  });
  return index * 10 + Math.random() * 10;
}

// 抽取目的地
function generatePOSS() {
  // console.log(posNode, TIME);
  const randomNum1 =
    Math.random() * (roadNet.areaInfo[0].count + roadNet.areaInfo[1].count);
  const randomNum2 = randomNum1 - roadNet.areaInfo[0].count;
  return (
    roadNet.areaInfo[0].nodes.find(
      (node: any) => node.from <= randomNum1 && node.to >= randomNum1
    ) ||
    roadNet.areaInfo[1].nodes.find(
      (node: any) => node.from <= randomNum2 && node.to >= randomNum2
    )
  );
}
// 抽取目的地
function generateDestination(posNode: any, TIME?: any) {
  // console.log(posNode, TIME);
  const randomNum1 = Math.random();
  let randomNum2 = Math.random();
  // 确定节点类型为 住宅区 还是 商业区
  let nodeType = posNode.category;
  // 如果 随机数 小于等于 同区常数, 则计算前往异区某节点的概率
  if (randomNum1 <= roadNet.areaInfo[nodeType].case) {
    nodeType = Number(!nodeType);
  }
  randomNum2 *= roadNet.areaInfo[nodeType].count;
  return roadNet.areaInfo[nodeType].nodes.find(
    (node: any) => node.from <= randomNum2 && node.to >= randomNum2
  );
}

function getUseTime(v: any, from: any, to: any, time: any) {
  return from.link[to.id] / v;
}

function computeData(simpleSize: number) {
  const V_ORIGIN = 80;
  const V_EMPTY = 20;
  const W = 60;
  const P = 40;

  const SOC_S_Array = new Array(simpleSize)
    .fill(0)
    .map(() => generateSocSArray());
  // const SOC_E_Array = new Array(simpleSize).map(()=>generateSocE_ARRAY())
  const TIME_START_Array = new Array(simpleSize).fill(0);
  const data: { year: string; p: any; time: number }[] = [];
  const use_time_arr_pos: any = {};
  const SOC_S_ARRAY_T: number[] = [];
  // 抽取10000个随机起始时间, 对每一个随机起始时间进行模拟
  TIME_START_Array.forEach((xxx: number, index: number) => {
    let time = 0;
    let POS_CUR = generatePOSS().id;
    let CUR_NODE = roadNet.nodes[POS_CUR];
    // console.log('起始节点', CUR_NODE, POS_CUR);
    let C_FLAG = false;
    // 随机抽取起始电量
    const SOC_SC = SOC_S_Array[index];
    let SOC_CUR = generateSocE(SOC_SC);
    SOC_S_ARRAY_T.push(SOC_CUR / 0.175);
    while (time < 24) {
      // 接客概率 与所在位置以及时间点有关
      let isLoad = Math.random() > 0.5;
      if (isLoad) {
        // 接客, 抽取目的地
        // 根据od数据概率抽取目的地
        // console.log('当前节点', CUR_NODE, POS_CUR);
        const destination = generateDestination(CUR_NODE).id;
        // 计算电量消耗
        const path = graph.findShortestPath(POS_CUR, destination) || [];
        const distancePath = [];
        let timeInt = 0;
        const distance = path.reduce((pre, cur, subIndex) => {
          if (subIndex < path.length - 1) {
            timeInt += getUseTime(
              V_ORIGIN,
              roadNet.nodes?.[Number(cur)],
              roadNet.nodes?.[Number(path[subIndex + 1])],
              time + timeInt
            );
            distancePath.push({
              distance:
                roadNet.nodes?.[Number(cur)]?.link?.[path[subIndex + 1]],
              from: Number(cur),
              to: Number(path[subIndex + 1]),
            });
            return (
              roadNet.nodes?.[Number(cur)]?.link?.[path[subIndex + 1]] + pre
            );
          }
          return pre;
        }, 0);
        const distanceCost = distance * 0.175;
        if (distanceCost > SOC_CUR) {
          // continue
          // 该客人不可接, 需要跳过
          isLoad = false;
        } else {
          // 更新剩余电量, 位置, 时间
          SOC_CUR -= distanceCost;
          POS_CUR = destination;
          CUR_NODE = roadNet.nodes[POS_CUR];
          // console.log('当前节点', CUR_NODE, POS_CUR);
          // todo : 计算通行时间
          time += timeInt;
        }
      }
      if (!isLoad) {
        // 未接客
        // 是否前往下一个节点
        const isChangePos = Math.random() > 0.25;
        if (isChangePos) {
          // 前往下一个节点
          // 抽取目的地, 从路网关系中抽取
          // todo: 根据路网关系抽取下一节点
          const arrTemp = Object.keys(CUR_NODE.link);
          const POS_CUR_TEMP =
            arrTemp[Math.floor(Math.random() * arrTemp.length)];
          const distance = CUR_NODE.link[POS_CUR_TEMP];
          const distanceCost = distance * 0.175;
          if (SOC_CUR > distanceCost) {
            // 更新剩余电量
            SOC_CUR -= distanceCost;
            time += distance / V_EMPTY;
            POS_CUR = POS_CUR_TEMP;
            CUR_NODE = roadNet.nodes[POS_CUR];
            // console.log('当前节点', CUR_NODE, POS_CUR);
          } else {
            // 电量不足, 去充电
            C_FLAG = true;
          }
        } else {
          // 停留在当前节点
          // 空载15分钟
          time += 0.25;
          const distanceCost = V_EMPTY * 0.25 * 0.175;
          // 更新剩余电量
          SOC_CUR -= distanceCost;
        }
      }
      // console.log(time, SOC_CUR);
      if (SOC_CUR < SOC_SC || C_FLAG) {
        // 如果当前电量低于应充电电量, 则就地充电
        // 随机抽取充电结束电量
        const SOC_E = generateSocE(SOC_CUR);
        // 计算充电消耗时间
        const USE_TIME = (W * (SOC_E - SOC_CUR)) / P / 100;
        const TIME_START = time;
        SOC_CUR = SOC_E;
        // 计算充电结束时间
        const TIME_END = Math.ceil(TIME_START + USE_TIME);
        const st = Math.floor(TIME_START);
        // 将充电时间段累加到24小时数组
        if (!use_time_arr_pos[POS_CUR]) {
          use_time_arr_pos[POS_CUR] = new Array(24).fill(0);
        }
        const use_time_arr = use_time_arr_pos[POS_CUR];
        for (let i = st >= 0 ? st : 23; i <= TIME_END; i += 1) {
          if (i > 23) {
            use_time_arr[i - 24] += 1;
          } else {
            use_time_arr[i] += 1;
          }
        }
      }
    }
  });
  const res = [];
  let max = 0;
  for (let i = 0; i < roadNet.nodes.length; i += 1) {
    res.push(
      ...use_time_arr_pos[i].map((item: any, index: any) => {
        if (item > max) max = item;
        return [i, index, item];
      })
    );
  }
  console.log('result: ', res);
  console.timeEnd('excute');
  return [res, max];
}

function excute(size: number, type?: boolean) {
  // console.time('excute');
  // const data = computeData(size);
  // const fs = require('fs');
  // fs.writeFile(`data-${size}.json`, JSON.stringify(data), (err: any) => {
  //   if (err) throw err;
  //   console.log('数据已被追加到文件');
  // });
  // return data;
  // let data: any = json100;
  // if (size === 100) {
  //   data = JSON.parse(JSON.stringify(json100));
  // }
  // if (size === 1000) {
  //   data = JSON.parse(JSON.stringify(json10000));
  // }
  // if (size === 10000) {
  //   data = JSON.parse(JSON.stringify(json10000));
  // }
  let max = 0;
  let temp = null;
  // data[0].forEach((item: any, index: number) => {
  //   item[2] *= xxx[item[1]];
  // });
  const data = JSON.parse(JSON.stringify(data10000));
  if (type) {
    data[0].forEach((item: any) => {
      const [node, time, count] = item;
      if (count > 900) {
        item[2] = count / 2;
        if (max < item[2]) {
          max = item[2];
          temp = item;
          console.log(temp[2]);
        }
      }
      data[0].forEach((item1: any) => {
        const [node1, time1, count1] = item1;
        if (time1 === time) {
          item1[2] += Math.ceil(count / 2 / 77);
        }
      });
    });

    // data[1] = (data[1] / 3) * 2;
  }
  return data;
}

export default function Dijkstra() {
  // const [data, setData] = useState(() => option(excute(10000, false)));
  const [data1, setData1] = useState(() => option(excute(10000, true)));
  return (
    <Row>
      <ReactECharts option={data1} style={{ width: '100%', height: '75vh' }} />
      {/* <ReactECharts option={data1} style={{ width: '100%', height: '45vh' }} /> */}
      {/* <ReactECharts option={data1} style={{ width: '100%', height: '45vh' }} /> */}
    </Row>
  );
}
