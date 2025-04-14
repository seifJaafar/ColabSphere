// components/TaskDependencyGraph.jsx
import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import { DeleteDependencyDialog } from "./DeleteDependency";
import "@xyflow/react/dist/style.css";

const TaskDependencyGraphInner = ({
  tasks,
  dependencies,
  onDeleteDependency,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const { fitView } = useReactFlow();

  // Create node data from tasks
  useEffect(() => {
    const newNodes = tasks.map((task) => ({
      id: task.taskID,
      data: {
        label: (
          <div
            className="p-2 rounded shadow-sm"
            style={{
              backgroundColor: getStatusColor(task.status),
              border:
                selectedTask === task.taskID
                  ? "2px solid #6366f1"
                  : "1px solid #374151",
              color: "#f3f4f6",
              minWidth: "150px",
            }}
          >
            <div className="font-medium">{task.title}</div>
            <div className="text-xs">{task.status.replace("_", " ")}</div>
            {task.dueDate && (
              <div className="text-xs mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ),
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    }));

    setNodes(newNodes);

    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
  }, [tasks, selectedTask, fitView]);

  // Create edges from dependencies
  useEffect(() => {
    const newEdges = dependencies.map((dep) => ({
      id: `e${dep.taskId}-${dep.dependsOnId}`,
      source: dep.dependsOnId,
      target: dep.taskId,
      data: { depId: dep.id }, // Store dependency ID
      animated: true,
      style: {
        stroke: "#6b7280",
        cursor: "pointer", // Show pointer on hover
      },
      markerEnd: {
        type: "arrowclosed",
        color: "#6b7280",
      },
      label: getDependencyLabel(dep.dependencyType),
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: "#1f2937", opacity: 0.8 },
      labelStyle: {
        fill: "#f3f4f6",
        fontWeight: 700,
        fontSize: 12,
      },
    }));

    setEdges(newEdges);
  }, [dependencies]);

  const handleEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedEdge) {
      await onDeleteDependency(selectedEdge.data.depId);
      setSelectedEdge(null);
    }
  }, [selectedEdge, onDeleteDependency]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 500 });
  }, [fitView]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedTask(node.id);
    setSelectedEdge(null); // Deselect edge when clicking node
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null); // Deselect edge when clicking empty space
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      not_started: "#4b5563",
      in_progress: "#2563eb",
      completed: "#16a34a",
      delayed: "#dc2626",
      cancelled: "#6b7280",
    };
    return colors[status] || "#4b5563";
  };

  const getDependencyLabel = (type) => {
    const labels = {
      finish_to_start: "F→S",
      start_to_start: "S→S",
      finish_to_finish: "F→F",
      start_to_finish: "S→F",
    };
    return labels[type] || "";
  };

  return (
    <div style={{ height: "600px", width: "100%", backgroundColor: "#111827" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={onPaneClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls
          className="bg-gray-800 rounded-lg p-1"
          style={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
          }}
        />
        <MiniMap
          style={{ backgroundColor: "#1f2937" }}
          nodeColor={(n) =>
            getStatusColor(tasks.find((t) => t.taskID === n.id)?.status)
          }
          maskColor="#11182770"
        />
        <Background color="#4b5563" gap={16} variant="dots" />

        {/* Delete Confirmation Dialog */}
        <DeleteDependencyDialog
          DepID={selectedEdge?.data?.depId}
          open={!!selectedEdge}
          onOpenChange={(open) => !open && setSelectedEdge(null)}
          onConfirm={handleDeleteConfirm}
        />

        <Panel position="top-right">
          <button
            onClick={handleFitView}
            className="bg-gray-700 text-white p-2 rounded mr-2 hover:bg-gray-600 transition-colors"
          >
            Fit View
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const TaskDependencyGraph = (props) => (
  <ReactFlowProvider>
    <TaskDependencyGraphInner {...props} />
  </ReactFlowProvider>
);

export default TaskDependencyGraph;
