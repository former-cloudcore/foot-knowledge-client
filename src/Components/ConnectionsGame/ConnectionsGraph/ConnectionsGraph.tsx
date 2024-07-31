import { useState, useEffect, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import data from '../../../utils/teamsColors.json';

const teamColors = JSON.parse(JSON.stringify(data));

export interface graphData {
  nodes: { id: string; img_ref: string; name: string; fx?: number; fy?: number }[];
  links: { source: string; target: string; label: string; years: string; timesMet: number }[];
}

interface ConnectionsGraphProps {
  graphData: graphData;
  nodesSize: Map<string, number>;
  freezeLayout: boolean;
  customColors: boolean;
}

const ConnectionsGraph = ({ graphData, nodesSize, freezeLayout, customColors }: ConnectionsGraphProps) => {
  const fgRef = useRef(null); // Reference to the ForceGraph2D instance

  // Set initial positions for the first two nodes
  useEffect(() => {
    if (graphData.nodes.length >= 2) {
      graphData.nodes[0].fx = -50;
      graphData.nodes[0].fy = 0;
      graphData.nodes[1].fx = 50;
      graphData.nodes[1].fy = 0;
    }
  }, [graphData]);

  // Center and zoom in on the first two nodes
  useEffect(() => {
    if (fgRef.current) {
      const graph = fgRef.current;
      const nodes = graphData.nodes;

      if (nodes.length >= 2) {
        const firstNode = nodes[0];
        const secondNode = nodes[1];
        const centerX = (firstNode.fx + secondNode.fx) / 2;
        const centerY = (firstNode.fy + secondNode.fy) / 2;

        graph.centerAt(centerX, centerY, 1000); // Center view
        graph.zoom(5); // Zoom in
      }
    }
  }, [graphData]);

  const drawLineWithColors = (canvas: HTMLCanvasElement, startPoint: { x: number; y: number }, endPoint: { x: number; y: number }, colors: string[], curvature: number) => {
    const ctx = canvas.getContext('2d');
    const numSegments = 50; // You can adjust this for smoother or more detailed lines
    let currentX = startPoint.x;
    let currentY = startPoint.y;

    for (let i = 0; i < numSegments; i++) {
      const t = i / numSegments;
      const invT = 1 - t;
      const midX = invT * startPoint.x + t * endPoint.x;
      const midY = invT * startPoint.y + t * endPoint.y;

      const controlX = midX + curvature * (endPoint.y - startPoint.y);
      const controlY = midY - curvature * (endPoint.x - startPoint.x);

      const x = invT * invT * startPoint.x + 2 * invT * t * controlX + t * t * endPoint.x;
      const y = invT * invT * startPoint.y + 2 * invT * t * controlY + t * t * endPoint.y;
      const color = colors[i % colors.length]; // Cycle through colors

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.stroke();
      }

      currentX = x;
      currentY = y;
    }
  };

  const [otherTeamsColors, setOtherTeamsColors] = useState<Map<string, string[]>>(new Map());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getOtherTeamsColor = (teamName: string) => {
    if (otherTeamsColors.has(teamName)) return otherTeamsColors.get(teamName);
    const color = ['#' + Math.floor(Math.random() * 16777215).toString(16)];
    setOtherTeamsColors((prev) => {
      const newMap = new Map(prev);
      newMap.set(teamName, color);
      return newMap;
    });
    return color;
  };

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      width={850}
      height={450}
      linkLabel={(link) => link.label + ' (' + link.years + ')'}
      linkAutoColorBy={(link) => link.label}
      linkCurvature={(link) => {
        return link.timesMet % 2 === 0 ? 0.2 * link.timesMet : -0.2 * (link.timesMet + 1);
      }}
      nodeCanvasObject={(node, ctx) => {
        const size = 5;

        const img = new Image(size, size);
        img.src = node.img_ref; // Path to your node image

        ctx.drawImage(img, (node.x || 0) - size / 2, (node.y || 0) - size / 2, size, size);
      }}
      cooldownTicks={freezeLayout ? 0 : Infinity}
      nodePointerAreaPaint={(node, color, ctx) => {
        const size = 5;
        ctx.fillStyle = color;
        ctx.fillRect((node.x || 0) - size / 2, (node.y || 0) - size / 2, size, size); // draw square as pointer trap
      }}
      nodeLabel={(node) => node.name + ' (' + ((nodesSize.get(node.id) || 5) - 5) + ')'}
      onNodeClick={(node) => {
        if (selectedNode === node.id) {
          setSelectedNode(null);
          return;
        }
        setSelectedNode(node.id);
      }}
      linkVisibility={(link) => {
        return !selectedNode || link.source.id === selectedNode || link.target.id === selectedNode;
      }}
      linkDirectionalArrowLength={0} // Disable directional arrows
      linkDirectionalParticles={0} // Disable directional particles
      linkCanvasObject={
        customColors
          ? (link, ctx) => {
            const colors = teamColors[link.label] ?? getOtherTeamsColor(link.label);

            drawLineWithColors(
              ctx.canvas,
              { x: link.source.x, y: link.source.y },
              { x: link.target.x, y: link.target.y },
              colors,
              link.timesMet % 2 === 0 ? 0.2 * link.timesMet : -0.2 * (link.timesMet + 1)
            );
          }
          : undefined
      }
      onLinkClick={(link) => {
        navigator.clipboard.writeText(link.label);
      }}
      // Ensure fixed nodes don't move during layout
      onEngineStop={() => {
        // Set fx and fy for fixed nodes
        graphData.nodes.forEach(node => {
          if (node.fx !== undefined && node.fy !== undefined) {
            node.fx = node.fx;
            node.fy = node.fy;
          }
        });
      }}
    />
  );
};

export default ConnectionsGraph;
