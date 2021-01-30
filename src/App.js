import Header from "./components/Header";
import Tasks from "./components/Tasks";
import React, {useState, useEffect} from 'react';
import AddTasks from "./components/AddTasks";
function App() {
  const [tasks, setTasks] = useState([])
  const [showAddTask, setshowAddTask] = useState(false);

  useEffect(() => {
      const getTasks = async () => {
        const taskfromServer = await fetchTasks();
        setTasks(taskfromServer);
      }
      getTasks();
  }, [])

  //Fetch Tasks from server
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    return data
  }

  //Fetch Task from server
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data
  }

  //Delete Task From server
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => (
      task.id!==id
    )))
  }

  //Toggle Reminder on Server
  const toggelReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) => (
      task.id === id ? {...task, reminder:data.reminder} : task
    )))
  }

  // Add Task
  const addTask = async (task) => {
      const res = await fetch(`http://localhost:5000/tasks`, 
      {
        method: 'POST',
        headers: {
          'Content-type':'application/json',
        },
        body: JSON.stringify(task)
      })

      const data = await res.json()
      setTasks([
        ...tasks,
        data
      ])
  }
    return (
      
      <div className="container">
        <Header onAdd={() => setshowAddTask(!showAddTask)} showAdd={showAddTask}/>
        {showAddTask && <AddTasks  onAdd={addTask}/>}
        {tasks.length>0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggelReminder}/> : 'No Task to show'}
      </div>
    );
  }

  export default App;
