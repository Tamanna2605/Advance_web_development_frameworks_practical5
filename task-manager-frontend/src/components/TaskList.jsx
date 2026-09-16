function TaskList({ tasks }) {
  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div className="task" key={task._id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>
              Status: {task.completed ? "Completed" : "Pending"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;