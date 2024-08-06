import { useEffect, useState } from 'react';
import SearchBox from '../SearchBox/SearchBox';
import css from './ConnectionsGame.module.css';
import ConnectionsGraph, { graphData } from './ConnectionsGraph/ConnectionsGraph';
import { playerSchema } from '../../utils/api.interfaces';
import { fetch_connections, fetch_path, mass_fetch_connections } from '../../utils/api';
import ScoreBar from '../GridGame/ScoreBar/ScoreBar';
import { playersBank } from '../../utils/connectionStuff.json';

const ConnectionsGame = () => {
  const [nodes, setNodes] = useState<graphData['nodes']>([]);
  const [links, setLinks] = useState<graphData['links']>([]);
  const [isGraphDataUpdated, setIsGraphDataUpdated] = useState(true);
  const [freezeLayout, setFreezeLayout] = useState(false);
  const [isCustomColors, setIsCustomColors] = useState(false);
  const [shortestPath, setShortestPath] = useState<graphData['nodes']>([]);
  const [currShortestPath, setCurrShortestPath] = useState<{ length: number, path: graphData['nodes'] }>
    ({ length: - 1, path: [] });
  const [addedPlayersNum, setAddedPlayersNum] = useState<number>(0);
  const [resetTime, setResetTime] = useState(false);
  const [isDisplayOnlyShortest, setIsDisplayOnlyShortest] = useState(false);
  const [allNodes, setAllNodes] = useState<graphData['nodes']>([]);
  const [allLinks, setAllLinks] = useState<graphData['links']>([]);

  useEffect(() => {
    initGame();
  }, [])


  useEffect(() => {
    if (nodes.length > 2) {
      updateGraphWithConnections();
    }
  }, [nodes]);

  useEffect(() => {
    setIsGraphDataUpdated(true);

    if (links.length > 1 && !isDisplayOnlyShortest) {
      setCurrShortestPath(findShortestPath());
    }
  }, [links])

  useEffect(() => {
    if (currShortestPath.length > 0) {
      if (isDisplayOnlyShortest) {
        setAllNodes(nodes);
        setAllLinks(links);
        const pathNodes = nodes.filter(node => currShortestPath.path.find(pathNode => pathNode.id === node.id));
        setNodes(pathNodes);
        const pathLinks = links.filter(link =>
          currShortestPath.path.find(node => node.id === link.source.id) &&
          currShortestPath.path.find(node => node.id === link.target.id)
        );
        setLinks(pathLinks);
      } else {
        setNodes(allNodes);
        setLinks(allLinks);
      }
    }
  }, [isDisplayOnlyShortest])

  const updateGraphWithConnections = async () => {
    const player = nodes[nodes.length - 1];

    const newLinks: graphData['links'] = [];
    const connections = await mass_fetch_connections(
      player.id,
      nodes.map((node) => node.id).slice(0, nodes.length - 1)
    );
    connections.forEach((connection) => {
      if (connection.connections.length > 0) {
        connection.connections.forEach((connection_detail, index) => {
          newLinks.push({
            source: player.id,
            target: connection.player_id.toString(),
            label: connection_detail.team_name,
            years: connection_detail.years,
            timesMet: index,
          });
        });
      }
    });

    setLinks((prev) => [...prev, ...newLinks]);
    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (isGraphDataUpdated) {
          setIsGraphDataUpdated(false);
          clearInterval(intervalId);
          resolve();
        }
      }, 10); // Check every 10 milliseconds
    });
  };

  const addPlayer = async (player: playerSchema) => {
    setIsGraphDataUpdated(false);
    setNodes((prev) => [...prev, convertPlayerToNode(player)]);
    setAddedPlayersNum((prev) => prev + 1);

    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (isGraphDataUpdated) {
          clearInterval(intervalId);
          resolve();
        }
      }, 10); // Check every 10 milliseconds
    });
  };

  const restartGame = () => {
    resetScore();
    setNodes([]);
    setLinks([]);
    setAllLinks([]);
    setAllNodes([]);
    initGame();
  }

  const resetScore = () => {
    setAddedPlayersNum(0);
    setCurrShortestPath({ length: -1, path: [] });
    setResetTime(prev => !prev);
  }

  const initGame = async () => {
    let player1, player2, connections_number;
    do {
      player1 = playersBank[Math.floor(Math.random() * playersBank.length)];
      player2 = playersBank[Math.floor(Math.random() * playersBank.length)];
      connections_number = (await fetch_connections(player1.player_id, player2.player_id)).length;
    } while (player1.player_id === player2.player_id || connections_number);

    setNodes(([player1, player2]).map((player => convertPlayerToNode(player))));
    setPossibleShortestPath(player1, player2);
  }

  const setPossibleShortestPath = async (player1: playerSchema, player2: playerSchema) => {
    const playersInPath: playerSchema[] = await fetch_path(player1.player_id.toString(), player2.player_id.toString());
    setShortestPath(playersInPath.map((player) => convertPlayerToNode(player)));
  }

  const findShortestPath = () => {
    if (nodes.length < 2) return { length: -1, path: [] }; // Ensure there are at least two nodes

    const startId = nodes[0].id;
    const endId = nodes[1].id;

    // Create adjacency list from nodes and links
    const adjList = nodes.reduce((acc, node) => {
      acc[node.id] = [];
      return acc;
    }, {});

    links.forEach((link) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      if (!adjList[sourceId].includes(targetId)) {
        adjList[sourceId].push(targetId);
      }
      if (!adjList[targetId].includes(sourceId)) {
        adjList[targetId].push(sourceId);
      }
    });

    const queue = [startId];
    const visited = new Set([startId]);
    const distance = { [startId]: 0 };
    const predecessor = { [startId]: null }; // To keep track of the path

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode === endId) {
        const path = [];
        let step = endId;
        while (step !== null) {
          const node = nodes.find((n) => n.id === step); // Find the node object
          if (node) path.unshift(node); // Add the node object to the path
          step = predecessor[step];
        }
        return { length: distance[currentNode] + 1, path };
      }

      adjList[currentNode]?.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          distance[neighbor] = distance[currentNode] + 1;
          predecessor[neighbor] = currentNode; // Record the predecessor
        }
      });
    }

    return { length: -1, path: [] }; // Return -1 if no path found
  };


  const convertPlayerToNode = (player: playerSchema) => {
    return { id: player.player_id.toString(), img_ref: player.img_ref, name: player.name }
  }

  return (
    <div className={css.connectionsGame}>
      <div className={css.connectionsGameHeader}>
        <h1>Connections Game</h1>
        <div className={css.top}>
          <SearchBox
            onSelectFullPlayer={(player) => {
              if (!nodes.find((node) => node.id === player.player_id.toString())) {
                addPlayer(player);
              }
            }}
          />
          <button onClick={restartGame}>Restart game</button>
          <button onClick={() => setFreezeLayout((prev) => !prev)}>
            {freezeLayout ? 'Unlock nodes' : 'Lock nodes'}
          </button>
          <button onClick={() => setIsCustomColors((prev) => !prev)}>
            {isCustomColors ? 'Default colors' : 'Custom colors'}
          </button>
          <button onClick={() => setIsDisplayOnlyShortest((prev) => !prev)} disabled={!currShortestPath.path.length}>
            {isDisplayOnlyShortest ? 'All Connections' : 'Shortest Path Only'}
          </button>
        </div>
      </div>
      <div className={css.connectionsGameBoard}>
        <ConnectionsGraph
          graphData={{ nodes, links }}
          freezeLayout={freezeLayout}
          customColors={isCustomColors}
        />
      </div>
      <ScoreBar board='connections' playersNumber={addedPlayersNum} resetTime={resetTime} currShortestPath={currShortestPath.length}
        shortestPath={shortestPath}></ScoreBar>
    </div>
  );
};

export default ConnectionsGame;
