import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';

const columnsFromBackend = {
  'To Do': [],
  'In Progress': [],
  'Done': []
};

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState(columnsFromBackend);
  const token = localStorage.getItem('token');

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/tickets/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const organized = {
        'To Do': [],
        'In Progress': [],
        'Done': []
      };

      res.data.forEach((ticket) => {
        organized[ticket.status].push(ticket);
      });

      setColumns(organized);
    } catch (err) {
      console.error('Error loading tickets:', err);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5050/api/tickets/${ticketId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error updating ticket:', err);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];

    const [movedTicket] = sourceCol.splice(source.index, 1);
    movedTicket.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTicket);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    });

    updateTicketStatus(movedTicket._id, destination.droppableId);
  };

  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  return (
    <div className="mt-6 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 min-w-[900px]">
          {Object.entries(columns).map(([columnId, tickets]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => (
                <div
                  className={`bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 transition ${
                    snapshot.isDraggingOver ? 'bg-blue-100' : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="text-lg font-bold mb-4 text-gray-700">{columnId}</h2>
                  <div className="space-y-4 min-h-[100px]">
                    {tickets.map((ticket, index) => (
                      <Draggable draggableId={ticket._id} index={index} key={ticket._id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded shadow border-l-4 ${
                              ticket.priority === 'High'
                                ? 'border-red-500'
                                : ticket.priority === 'Medium'
                                ? 'border-yellow-500'
                                : 'border-gray-400'
                            } transition ${
                              snapshot.isDragging ? 'bg-blue-50 scale-[1.01]' : ''
                            }`}
                          >
                            <div className="font-semibold text-gray-800">
                              {ticket.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                              <span>{ticket.priority} Priority</span>
                              <span className="italic">{ticket.status}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;