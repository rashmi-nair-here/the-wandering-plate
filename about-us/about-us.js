// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUTBG4HAS2WkdXDcxm5lsmetBZZf4zrTo",
    authDomain: "the-wandering-plate.firebaseapp.com",
    projectId: "the-wandering-plate",
    storageBucket: "the-wandering-plate.firebasestorage.app",
    messagingSenderId: "723153309356",
    appId: "1:723153309356:web:b6ae342720db686f445909"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user)=> {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if(loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=> {
            if(docSnap.exists()){
                const userData = docSnap.data();
                document.getElementById('loggedUserName').innerText = userData.firstName + " " + userData.lastName;
            }
            else{
                console.log("No document found matching ID");
            }
        })
        .catch((error)=> {
            console.log("Error getting document");
        })
    }
    else {
        console.log("User ID not found in Local Storage")
    }
})

const logoutButton = document.getElementById('logUserOut');

logoutButton.addEventListener('click', ()=> {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=> {
        window.location.href = '../home-page/home-page.html'
    })
    .catch((error)=> {
        console.error('Error in signing out: ', error);
    })
})

let hideTimeout;

const loggedUserName = document.getElementById('loggedUserName');
const heading = document.getElementById('header');
const logOutWrapper = document.querySelector('.logUserOut');
const loggedUsernameButton = document.getElementById('logUserOut');

loggedUserName.addEventListener('mouseover', (e)=>{
    e.preventDefault();
    clearTimeout(hideTimeout);
    logOutWrapper.style.display = 'flex';
    logOutWrapper.style.opacity = 1;
    heading.style.display = 'none';
})

loggedUsernameButton.addEventListener('mouseover', (e)=>{
    e.preventDefault();
    clearTimeout(hideTimeout);
    logOutWrapper.style.display = 'flex';
    logOutWrapper.style.opacity = 1;
    heading.style.display = 'none';
})

loggedUserName.addEventListener('mouseout', (e)=> {
    e.preventDefault();
    hideTimeout = setTimeout(() => {
    logOutWrapper.style.display = 'none';
    logOutWrapper.style.opacity = 0;
    heading.style.display = 'block';
    }, 100);
})

loggedUsernameButton.addEventListener('mouseout', (e)=> {
    e.preventDefault();
    hideTimeout = setTimeout(() => {
    logOutWrapper.style.display = 'none';
    logOutWrapper.style.opacity = 0;
    heading.style.display = 'block';
    }, 100);
})