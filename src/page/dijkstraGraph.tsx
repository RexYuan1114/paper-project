/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import Graph from '../../doc/dijkstra';
import roadNet from '../../doc/roadNetData';

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
function generateDestination(POS: any) {
  const randomNum = Math.random();
  const posNode = roadNet[POS];
  // 确定节点类型为 住宅区 还是 商业区
  const nodeType = posNode.category;

  return '0';
}

function computeData() {
  const simpleSize = 1000;

  const V_ORIGIN = 80;
  const V_EMPTY = 20;
  const W = 60;
  const P = 40;

  const SOC_S_Array = new Array(simpleSize).map(() => generateSocSArray());
  // const SOC_E_Array = new Array(simpleSize).map(()=>generateSocE_ARRAY())
  const TIME_START_Array = new Array(simpleSize);
  const data: { year: string; p: any; time: number }[] = [];
  const use_time_arr_pos: any = {};
  // 抽取10000个随机起始时间, 对每一个随机起始时间进行模拟
  TIME_START_Array.forEach((xxx: number, index: number) => {
    let time = 0;
    let POS_CUR = '0';
    let CUR_NODE = roadNet.nodes[POS_CUR];
    let C_FLAG = false;
    // 随机抽取起始电量
    const SOC_SC = SOC_S_Array[index];
    let SOC_CUR = generateSocE(SOC_SC);
    while (time < 24) {
      // 接客概率 与所在位置以及时间点有关
      let isLoad = Math.random() > 0.5;
      if (isLoad) {
        // 接客, 抽取目的地
        // todo: 根据od数据概率抽取目的地
        const destination = '1';
        // 计算电量消耗
        const path = graph.findShortestPath(POS_CUR, destination) || [];
        const distancePath = [];
        const distance = path.reduce((pre, cur, subIndex) => {
          if (subIndex < path.length - 1) {
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
          // todo : 计算时间
          time += 2;
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
          POS_CUR = '2';
          C_FLAG = true;
        } else {
          // 停留在当前节点
          // 空载15分钟
          time += 0.25;
          const distanceCost = V_EMPTY * 0.25;
          // 更新剩余电量
          SOC_CUR -= distanceCost;
        }
      }
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
  // 以上可得各节点24小时负荷情况即时空负荷分布图

  // console.timeEnd('useTime');
  // console.log(use_time_arr);
  // use_time_arr.forEach((item, index) => {
  //   const _2018 = item * 4;
  //   const _2023 = _2018 * 1.05 ** 5;
  //   const _2028 = _2023 * 1.05 ** 5;
  //   const _2033 = _2028 * 1.05 ** 5;
  //   data.push({ year: '2018', p: _2018, time: index });
  //   data.push({ year: '2023', p: _2023, time: index });
  //   data.push({ year: '2028', p: _2028, time: index });
  //   data.push({ year: '2033', p: _2033, time: index });
  // });
  // return data;
}

export default function Dijkstra() {
  console.log(
    roadNet,
    graph,
    graph.findShortestPath('0', '50', '60') // => ['a', 'c', 'b']
  );
  return <div>1</div>;
}
