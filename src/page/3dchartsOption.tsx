import roadNet from '../../doc/roadnetData';

const hours = new Array(24).fill(1).map((item, index) => {
  return `${index >= 10 ? index : `0${index}`}:00`;
});
const days = roadNet.nodes.map((node: any) => node.id);
const option = (data: any) => ({
  tooltip: {},
  visualMap: {
    max: 2300,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
      ],
    },
  },
  xAxis3D: {
    type: 'category',
    data: hours,
    name: '时间',
  },
  yAxis3D: {
    type: 'category',
    // data: nodes,
    data: days,
    name: '节点',
  },
  zAxis3D: {
    type: 'value',
    name: '负荷/千瓦时',
    max: 2500,
  },
  grid3D: {
    boxWidth: 200,
    boxDepth: 350,
    light: {
      main: {
        intensity: 1.2,
      },
      ambient: {
        intensity: 0.3,
      },
    },
  },
  series: [
    {
      type: 'bar3D',
      data: data[0].map(function (item: any) {
        return {
          value: [item[1], item[0], item[2]],
        };
      }),
      shading: 'color',

      label: {
        show: false,
        fontSize: 16,
        borderWidth: 1,
      },

      itemStyle: {
        opacity: 0.7,
      },

      emphasis: {
        label: {
          fontSize: 20,
          color: '#900',
        },
        itemStyle: {
          color: '#900',
        },
      },
    },
  ],
});

export default option;
