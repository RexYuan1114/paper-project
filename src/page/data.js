import json10000 from './data-10000.json';

const xxx = [
  0.6,
  0.57,
  0.55,
  0.54,
  0.57,
  0.65,
  0.72,
  0.77,
  0.81,
  0.85,
  0.89,
  0.85,
  0.81,
  0.77,
  0.75,
  0.77,
  0.74,
  0.71,
  0.74,
  0.77,
  0.81,
  0.77,
  0.74,
  0.71,
];

const data = JSON.parse(JSON.stringify(json10000));
const total = new Array(24).fill(0);
data[0].forEach((item, index) => {
  item[2] *= xxx[item[1]];
});
data[0].forEach((item) => {
  const [node, time, count] = item;
  total[time] += count;
});
data[2] = total;

export default data;
