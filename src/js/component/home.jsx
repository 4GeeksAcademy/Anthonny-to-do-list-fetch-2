import React, { useEffect, useState } from "react";

const initialTask = {
	label: "",
	is_done: false
}

const URLBASE = "https://playground.4geeks.com/todo"

const Home = () => {

	const [task, setTask] = useState(initialTask)
	const [todos, setTodos] = useState([])

	const handleChange = ({ target }) => {
		setTask({
			...task,
			[target.name]: target.value
		})
	}

	const addTask = async (event) => {
		try {
			if (event.key == "Enter") {
				if (task.label.trim !== "") {
					const responde = await fetch(`${URLBASE}/todos/anthonny`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(task)
					})
					if (responde.ok) {
						getAllTask()
						setTask(initialTask)
					} else {
						console.log("Debo manejar el error")
					}
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const deleteTask = (id) => {
		fetch(`${URLBASE}/todos/${id}`, {
			method: "DELETE"
		})
			.then((responde) => getAllTask())
			.catch((error) => console.log(error))
	}

	const getAllTask = async () => {
		try {
			let responde = await fetch(`${URLBASE}/users/anthonny`)
			let data = await responde.json()

			if (responde.status == 404) {
				createUser()
				getAllTask()
			} else {
				setTodos(data.todos)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const createUser = async () => {
		try {
			let response = await fetch(`${URLBASE}/users/anthonny`, {
				method: "POST"
			})

			console.log(response)
		} catch (error) {
			console.log(error)
		}
	}

	const deleteAll = async () => {
		try {
			let responde = await fetch(`${URLBASE}/users/anthonny`, {
				method: "DELETE"
			})
			if (responde.status == 204) {
				getAllTask()
				alert("Todo fue eliminado")
			}
		} catch (error) {
			console.log(error)
		}

	}

	useEffect(() => {
		getAllTask()
	}, [])

	return (
		<div className="container d-flex flex-column align-items-center">
			<div className="row">
				<div className="col-12 text-center">
					<h1 className="mb-4">To Do List Fetch</h1>
					<form onSubmit={(event) => event.preventDefault()} className="mb-3">
						<input
							className="form-control mb-2"
							type="text"
							placeholder="¿Tarea a realizar?"
							name="label"
							value={task.label}
							onChange={handleChange}
							onKeyDown={addTask}
						/>
					</form>
					<div className="list-group w-100">
						{todos.map((item) => {
							return (
								<div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
									<div>{item.label}</div>
									<button
										className="btn btn-danger btn-sm"
										onClick={() => deleteTask(item.id)}
									>x</button>
								</div>
							);
						})}
					</div>
					<button
						className="btn btn-warning mt-3"
						onClick={() => { deleteAll(); }}
					>Eliminar Todo</button>
				</div>
			</div>
		</div>
	);

};

export default Home;