import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, settodo] = useState("")
  const [todos, settodos] = useState([])
  const [showFinishesd, setshowFinishesd] = useState(true)

  useEffect(() => {
    let todostring = localStorage.getItem("todos")
    if (todostring) {
      let todos = JSON.parse(todostring)
      settodos(todos)
    }
  }, [])

  const savetoLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  const togglefinished = (e) => {
    setshowFinishesd(!showFinishesd)
  }

  const handleAdd = () => {
    settodos([...todos, { id: uuidv4(), todo, iscompleted: false }])
    settodo("")
    savetoLS()
  }
  const handleEdit = (e, id) => {
    let t = todos.filter(item => { return item.id === id })
    settodo(t[0].todo)
    let newtodos = todos.filter(item => {
      return item.id !== id;
    });
    settodos(newtodos)
    savetoLS()
  }
  const handleDelete = (e, id) => {
    let newtodos = todos.filter(item => {
      return item.id !== id;
    });
    settodos(newtodos)
    savetoLS()
  }

  const handlechange = (e) => {
    settodo(e.target.value)
  }

  const handlecheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newtodos = [...todos];
    newtodos[index].iscompleted = !newtodos[index].iscompleted;
    settodos(newtodos)
    savetoLS()
  }

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto bg-violet-200 p-2 rounded-xl my-5 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-xl'>iTask - Manage Your Todos Here</h1>
        <div className="todo my-5 flex flex-col gap-4">
          <h2 className=" text-xl font-bold ">Add a Todo</h2>
          <div className="flex">

            <input type="text" onChange={handlechange} value={todo} className='w-full px-5 py-1 rounded-lg' />
            <button onClick={handleAdd} disabled={todo.length < 1} className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-600 p-2 py-1 text-sm text-white rounded-md mx-2'>Save</button>
          </div>
        </div>
        <input type="checkbox" onChange={togglefinished} checked={showFinishesd} />{""} Show Finished
        <h2 className='text-lg font-bold my-5'>Your Todos</h2>
        <div className="todos">

          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item => {
            return (showFinishesd || !item.iscompleted) && <div key={item.id} className="todo flex justify-between my-3">
              <div className="flex gap-5">
                <input onChange={handlecheckbox} type="checkbox" checked={item.iscompleted} name={item.id} id="" />
                <div className={item.iscompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm text-white rounded-md mx-1'><CiEdit /></button>
                <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm text-white rounded-md mx-1'><MdDelete /></button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
