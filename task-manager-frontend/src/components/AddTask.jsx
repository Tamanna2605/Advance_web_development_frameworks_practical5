function AddTask({ onTaskAdded }) {
  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const task = {
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value
    };

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();

      onTaskAdded(newTask);
      form.reset();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Task</h2>

      <input
        name="title"
        placeholder="Task title"
        required
      />

      <input
        name="description"
        placeholder="Description"
      />

      <select name="priority" defaultValue="medium">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTask;