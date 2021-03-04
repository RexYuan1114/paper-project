import roadNet from '../../doc/roadNetData';

const map: any = [];
const data = JSON.parse(JSON.stringify(roadNet)).nodes.map((node: any) => {
  let max = 0;
  let keys = '';
  Object.entries(node.link).forEach((item: any, index: any) => {
    const [key, dis] = item;
    if (dis < max) {
      max = dis;
      keys = key;
    }
  });
  if (
    map.find((item: any) => {
      return (
        (item.source === keys && item.target === node.id) ||
        (item.target === keys && item.source === node.id)
      );
    })
  ) {
    // console.log();
  } else {
    map.push({ source: node.id, target: keys });
  }
  return node;
  // return 1;
});

console.log(map);

export default data;
