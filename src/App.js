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
  signInWithPopup,
  GoogleAuthProvider,
} from "@firebase/auth";

function App() {
  const [users, setUsers] = useState([]);

  //Taking data to register in FireStore...
  const [newName, setName] = useState();
  const [age, setAge] = useState();

  //Register Email & Password...
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  //Login Email & Password...
  const [loginEmail, setLoginEmail] = useState();
  const [logipassword, setLoginPassword] = useState();

  //Store Logged user for save Login info...
  const [loggedUser, setLoggedUser] = useState({});

  //Update User Id in FireStore...
  const updateUserID = async (id, age) => {
    const userDocs = doc(db, "users", id);
    const newField = { age: age + 1 };
    await updateDoc(userDocs, newField);
  };

  //Update User Name in FireStore...
  const updateUserName = async (id, name) => {
    const userDocs = doc(db, "users", id);
    // const newField = { name: newName };
    await updateDoc(userDocs, { name: name });
  };

  //Delete User from FireStore...
  const deleteUser = async (id) => {
    const userDocs = doc(db, "users", id);
    await deleteDoc(userDocs);
  };

  //on Auth Change add State of Auth in LoggedUser for save login history...
  onAuthStateChanged(auth, (currentUser) => {
    setLoggedUser(currentUser);
  });

  //Register New User in FireStore or Add User In FireStore...
  const Register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User in register", user);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Login In WIth Email and Password That are Registred In FireStore...
  const Login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        logipassword,
      );
      console.log("User in register", user);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Logout Current user...
  const Logout = async () => {
    await signOut(auth);
  };

  //Login With Google Account...
  const LoginWithGoogle = async () => {
    const Provider = new GoogleAuthProvider();
    try {
      const user = await signInWithPopup(auth, Provider);
      console.log("User in register", user);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Add data in FireBase...
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

  //Get data from FireBase...
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

  return (
    <div className="grid" key="main">
      <div className="App" key="app">
        {/* Register Email... */}
        <div className="card" key="Register">
          <h1>Register user</h1>
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

        {/* Login With Google & Email... */}
        <div className="card" key="login">
          <h1>Login user</h1>
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
          <button
            className="login-with-google-btn"
            onClick={LoginWithGoogle}
            // disabled="true"
          >
            Login with GOOGLE
          </button>
        </div>

        {/* Display Looged in User Email... */}
        <div className="card" key="Loggedin">
          <h1>Loged in user</h1>
          <h3>{loggedUser?.displayName}</h3>
          <h3>{loggedUser?.email}</h3>
          <img src={loggedUser?.photoURL} />
          <button onClick={Logout}>SignOut</button>
        </div>
      </div>

      {/* Display All Users Form FireStore... */}
      <div className="card" key="app1">
        {/* Register New User... */}
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

        {/* Map each Users from FireStore to */}
        {users.map((user) => {
          return (
            <div key={user.id} className="card">
              <h1>name:{user.name}</h1>
              <h1>born:{user.age}</h1>

              {/* Update Age by adding 1... */}
              <button
                onClick={() => {
                  updateUserID(user.id, user.age);
                }}
              >
                Upadate Age
              </button>

              {/* Delete User from FireStore... */}
              <button
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete User
              </button>

              {/* Update Name by Adding new Name to TextBox */}
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
    </div>
  );
}

export default App;
