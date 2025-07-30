import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";


import {useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "users", user.uid, "tasks"), (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [user]);
  

  const handleAddTask = async () => {
    if (task.trim() === "") return;
  

    await addDoc(collection(db,"users", user.uid, "tasks"), {
      text: task,
      completed: false,
      createdAt: Date.now()
    });

    setTask(""); // clear input
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const taskRef = doc(db, "users", user.uid, "tasks", id);
    await updateDoc(taskRef, {
      completed: !currentStatus,
    });
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    }catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    }catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="App">
  <h1>To-Do List</h1>

  {user ? (
    <>
      <p>Welcome, {user.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <input
        type="text"
        value={task}
        placeholder="Enter a task..."
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => handleToggleComplete(task.id, task.completed)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => handleDeleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  )}
</div>

  );
}

export default App;