import React from 'react';
import Graph from '../../doc/dijkstra';
import roadNet from '../../doc/roadNetData';

export default function Dijkstra() {
  const graph = new Graph(roadNet.nodeMap);
  console.log(
    graph,
    graph.findShortestPath('0', '50', '60') // => ['a', 'c', 'b']
  );
  return <div>1</div>;
}
