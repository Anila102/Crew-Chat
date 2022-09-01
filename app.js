  const firebaseConfig = {
    apiKey: "AIzaSyCwqL_XFECqIN1-EoumTpT9Pj-Um_Yj3R8",
    authDomain: "crew-chat-5848a.firebaseapp.com",
    projectId: "crew-chat-5848a",
    storageBucket: "crew-chat-5848a.appspot.com",
    messagingSenderId: "801330423362",
    appId: "1:801330423362:web:b2e2d058fa356e20f9afdb",
    measurementId: "G-R288W01W6V"
  };
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
const firestore = firebase.firestore();


const loggedIn = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            window.location.href="app.html"
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
}
const signUp = () => {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    console.log(email + password +name)
    firebase.auth().createUserWithEmailAndPassword( email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            window.location.href="login.html"
            console.log("User Created")

            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}
const logOut = () => {
    firebase.auth().signOut().then(() => {
        window.location.href="index.html"
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}

auth.onAuthStateChanged((user) => {
    // var username = username.value;
    console.log(user)
    if (user) {
        firestore.collection('users').doc(user.uid).set({
            email: user.email, 
            // username: username,
            lastLoggedInAt: new Date()
        })
        
            .then(() => {
                console.log("Document written");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        setData(user);
        setMessages();
      
    } else {
  
    }
});

const setData = (user) => {
    firestore.collection('users').doc(user.uid).get().then((querySnapshot) => {
        const data = querySnapshot.data();
        const lastLoggedInAt = data.lastLoggedInAt;
        const lastLoggedInSpan = document.getElementById("lastLoggedIn");
        lastLoggedInSpan.innerHTML = lastLoggedInAt;
    });
}

const setMessages = () => {
    const messagesRef = firestore.collection('messages');
    messagesRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                createElementsForMessage(change.doc.data());
            }
        });
    });
};

const sendMessage = () => {
    const user = auth.currentUser.email;
    const message = document.getElementById("message").value;
    firestore.collection('messages').add({
        user, message, time: Date.now()
    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
};

const createElementsForMessage = (childData) => {
    const messagesDiv = document.getElementById("messages");

    const childDiv = document.createElement('div');
    childDiv.classList.add("single-message-body");

    const messageTextDiv = document.createElement('div');
    messageTextDiv.classList.add("message-text");

    const senderDiv = document.createElement('div');
    senderDiv.classList.add("message-sender");

    messageTextDiv.innerHTML = childData.message;

    const userEmail = auth.currentUser.email;
    if (childData.user === userEmail) {
        senderDiv.innerHTML = "You";
        childDiv.classList.add("sender");
    } else {
        senderDiv.innerHTML = childData.user;
        childDiv.classList.add("reciever");
    }

    childDiv.appendChild(senderDiv);
    childDiv.appendChild(messageTextDiv);
    messagesDiv.appendChild(childDiv);
};