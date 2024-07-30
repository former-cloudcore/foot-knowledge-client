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
  const [nodesSize, setNodesSize] = useState<Map<string, number>>(new Map());
  const [isGraphDataUpdated, setIsGraphDataUpdated] = useState(true);
  const [freezeLayout, setFreezeLayout] = useState(false);
  const [isCustomColors, setIsCustomColors] = useState(false);
  const [shortestPath, setShortestPath] = useState<graphData['nodes']>([]);
  const [currShortestPath, setCurrShortestPath] = useState<number>(-1);
  const [addedPlayersNum, setAddedPlayersNum] = useState<number>(0);
  const [resetTime, setResetTime] = useState(false);

  useEffect(() => {
    initGame();
  }, [])

  useEffect(() => {
    setIsGraphDataUpdated(true);
  }, [links]);

  useEffect(() => {
    if (nodes.length < 2) return;
    const updateGraphWithConnections = async () => {
      const player = nodes[nodes.length - 1];

      const newLinks: graphData['links'] = [];
      const connections = await mass_fetch_connections(
        player.id,
        nodes.map((node) => node.id).slice(0, nodes.length - 1)
      );
      connections.forEach((connection) => {
        if (connection.connections.length > 0) {
          setNodesSize((prev) => {
            const newMap = new Map(prev);
            newMap.set(player.id.toString(), (prev.get(player.id.toString()) || 5) + 1);
            newMap.set(connection.player_id.toString(), (prev.get(connection.player_id.toString()) || 5) + 1);
            return newMap;
          });

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
    updateGraphWithConnections();
  }, [nodes]);

  useEffect(() => {
    if (links.length > 0) {
      setCurrShortestPath(findShortestPathLength());
    }
  }, [links])

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
    setNodesSize(new Map());
    initGame();
  }

  const resetScore = () => {
    setAddedPlayersNum(0);
    setCurrShortestPath(0);
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

  const findShortestPathLength = () => {
    if (nodes.length < 2) return -1; // Ensure there are at least two nodes

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

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode === endId) {
        return distance[currentNode] + 1;
      }

      adjList[currentNode]?.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          distance[neighbor] = distance[currentNode] + 1;
        }
      });
    }

    return -1; // Return -1 if no path found
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
        </div>
      </div>
      <div className={css.connectionsGameBoard}>
        <ConnectionsGraph
          graphData={{ nodes, links }}
          nodesSize={nodesSize}
          freezeLayout={freezeLayout}
          customColors={isCustomColors}
        />
      </div>
      <ScoreBar board='connections' playersNumber={addedPlayersNum} resetTime={resetTime} currShortestPath={currShortestPath}
      shortestPath={shortestPath.length}></ScoreBar>
    </div>
  );
};

export default ConnectionsGame;
