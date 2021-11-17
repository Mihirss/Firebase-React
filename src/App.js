import "./App.css";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import react from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setName] = useState();
  const [age, setAge] = useState();

  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: newName,
        age: Number(age),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateUser = async (id, age) => {
    const userDocs = doc(db, "users", id);
    const newField = { age: age + 1 };
    await updateDoc(userDocs, newField);
  };

  const updateUserName = async (id, name) => {
    const userDocs = doc(db, "users", id);
    // const newField = { name: newName };
    await updateDoc(userDocs, { name: name });
  };

  const deleteUser = async (id) => {
    const userDocs = doc(db, "users", id);
    await deleteDoc(userDocs);
  };

  useEffect(() => {
    const getuser = async () => {
      try {
        const data = await getDocs(collection(db, "users"));
        console.log("Document written with ID: ", data);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    getuser();
  }, []);

  const [email, setEmail] = useState();
  const [loginEmail, setLoginEmail] = useState();

  const [password, setPassword] = useState();
  const [logipassword, setLoginPassword] = useState();

  const [loggedUser, setLoggedUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setLoggedUser(currentUser);
  });

  const Register = async () => {
    try {
      const user = createUserWithEmailAndPassword(auth, email, password);
      console.log("User in register", user);
    } catch (error) {
      console.log(error.message);
    }
  };
  const Login = async () => {
    try {
      const user = signInWithEmailAndPassword(auth, loginEmail, logipassword);
      console.log("User in register", user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const Logout = async () => {
    await signOut(auth);
  };
  return (
    <>
      <div className="App" key="app">
        <h1>Register user</h1>
        <div>
          <input
            type="email"
            placeholder="Email..."
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button onClick={Register}>Register user</button>
        </div>
        <h1>Login user</h1>
        <div>
          <input
            type="email"
            placeholder="Email..."
            onChange={(e) => {
              setLoginEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
          <button onClick={Login}>Login user</button>
        </div>
        <div>
          <h1>Loged in user</h1>
          {loggedUser?.email}
          <button onClick={Logout}>SignOut</button>
        </div>
      </div>

      <div className="App" key="app1">
        <h1>List user</h1>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="age"
          onChange={(e) => {
            setAge(e.target.value);
          }}
        />
        <button onClick={addData}>add to fireStore</button>
        {users.map((user) => {
          return (
            <div key={user.id}>
              <h1>name:{user.name}</h1>
              <h1>born:{user.age}</h1>
              <button
                onClick={() => {
                  updateUser(user.id, user.age);
                }}
              >
                Upadate Age
              </button>
              <button
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete User
              </button>
              <input
                type="text"
                placeholder="UpdateName"
                onChange={(e) => {
                  updateUserName(user.id, e.target.value);
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

// import { collection, addDoc } from "firebase/firestore";

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815,
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }
