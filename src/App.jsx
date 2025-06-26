import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';

function App() {
  const [todo, settodo] = useState('');
  const [todos, settodos] = useState([]);
  const [showFinishesd, setshowFinishesd] = useState(true);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const todostring = localStorage.getItem('todos');
    if (todostring) {
      const todos = JSON.parse(todostring);
      settodos(todos);
    }
  }, []);

  // Save todos to localStorage whenever the todos state changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const togglefinished = () => {
    setshowFinishesd(!showFinishesd);
  };

  const handleAdd = () => {
    if (todo.trim()) {
      const newTodo = { id: uuidv4(), todo, iscompleted: false };
      // Add new task to state
      settodos((prevTodos) => [...prevTodos, newTodo]);
      settodo('');
    }
  };

  const handleEdit = (id) => {
    const taskToEdit = todos.find(item => item.id === id);
    settodo(taskToEdit.todo);

    // Remove the edited task from todos
    const newTodos = todos.filter(item => item.id !== id);
    settodos(newTodos);
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter(item => item.id !== id);
    settodos(newTodos);

    // Explicitly update localStorage after deletion
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const handlechange = (e) => {
    settodo(e.target.value);
  };

  const handlecheckbox = (e) => {
    const id = e.target.name;
    const updatedTodos = todos.map(item => 
      item.id === id ? { ...item, iscompleted: !item.iscompleted } : item
    );
    settodos(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto bg-violet-200 p-2 rounded-xl my-5 min-h-[80vh] md:w-1/2">
        <h1 className="font-bold text-center text-xl">iTask - Manage Your Todos Here</h1>
        <div className="todo my-5 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Add a Todo</h2>
          <div className="flex">
            <input
              type="text"
              onChange={handlechange}
              value={todo}
              className="w-full px-5 py-1 rounded-lg"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length < 1}
              className="bg-violet-800 hover:bg-violet-950 disabled:bg-violet-600 p-2 py-1 text-sm text-white rounded-md mx-2"
            >
              Save
            </button>
          </div>
        </div>
        <input
          type="checkbox"
          onChange={togglefinished}
          checked={showFinishesd}
        />
        {''} Show Finished
        <h2 className="text-lg font-bold my-5">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}
          {todos.map(item => {
            return (
              (showFinishesd || !item.iscompleted) && (
                <div key={item.id} className="todo flex justify-between my-3">
                  <div className="flex gap-5">
                    <input
                      onChange={handlecheckbox}
                      type="checkbox"
                      checked={item.iscompleted}
                      name={item.id}
                    />
                    <div className={item.iscompleted ? 'line-through' : ''}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex h-full">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm text-white rounded-md mx-1"
                    >
                      <CiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm text-white rounded-md mx-1"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
