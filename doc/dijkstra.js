/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-restricted-syntax */
const Graph = (function () {
  const extractKeys = function (obj) {
    const keys = [];
    let key;
    for (key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
    }
    return keys;
  };

  const sorter = function (a, b) {
    return parseFloat(a) - parseFloat(b);
  };

  const findPaths = function (map, start, end, infinity) {
    infinity = infinity || Infinity;

    const costs = {};
    const open = { 0: [start] };
    const predecessors = {};
    let keys;

    const addToOpen = function (cost, vertex) {
      const key = `${cost}`;
      if (!open[key]) open[key] = [];
      open[key].push(vertex);
    };

    costs[start] = 0;

    while (open) {
      if (!(keys = extractKeys(open)).length) break;

      keys.sort(sorter);

      const key = keys[0];
      const bucket = open[key];
      const node = bucket.shift();
      const currentCost = parseFloat(key);
      const adjacentNodes = map[node] || {};

      if (!bucket.length) delete open[key];

      for (const vertex in adjacentNodes) {
        if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
          const cost = adjacentNodes[vertex];
          const totalCost = cost + currentCost;
          const vertexCost = costs[vertex];

          if (vertexCost === undefined || vertexCost > totalCost) {
            costs[vertex] = totalCost;
            addToOpen(totalCost, vertex);
            predecessors[vertex] = node;
          }
        }
      }
    }

    if (costs[end] === undefined) {
      return null;
    }
    return predecessors;
  };

  const extractShortest = function (predecessors, end) {
    const nodes = [];
    let u = end;

    while (u !== undefined) {
      nodes.push(u);
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  };

  const findShortestPath = (map, nodes) => {
    let start = nodes.shift();
    let end;
    let predecessors;
    const path = [];
    let shortest;

    while (nodes.length) {
      end = nodes.shift();
      predecessors = findPaths(map, start, end);

      if (predecessors) {
        shortest = extractShortest(predecessors, end);
        if (nodes.length) {
          path.push(...shortest.slice(0, -1));
        } else {
          return path.concat(shortest);
        }
      } else {
        return null;
      }

      start = end;
    }
  };

  const toArray = function (list, offset) {
    try {
      return Array.prototype.slice.call(list, offset);
    } catch (e) {
      const a = [];
      for (let i = offset || 0, l = list.length; i < l; i += 1) {
        a.push(list[i]);
      }
      return a;
    }
  };

  const Graph = function (map) {
    this.map = map;
  };

  Graph.prototype.findShortestPath = function (start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return findShortestPath(this.map, start);
    }
    if (arguments.length === 2) {
      return findShortestPath(this.map, [start, end]);
    }
    return findShortestPath(this.map, toArray(arguments));
  };

  Graph.findShortestPath = function (map, start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return findShortestPath(map, start);
    }
    if (arguments.length === 3) {
      return findShortestPath(map, [start, end]);
    }
    return findShortestPath(map, toArray(arguments, 1));
  };

  return Graph;
})();

export default Graph;
