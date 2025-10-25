// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.innerHTML = message;
    messageDiv.classList.add("show");
    setTimeout(function(){
        messageDiv.classList.remove('show');
        messageDiv.innerHTML = "";
    }, 7000);
}

const signInButton = document.getElementById("signInButton");
const submitSignIn = document.getElementById("submitSignIn");
const signInForm = document.getElementById("signIn");
const createAccountButton = document.getElementById("signUpButton");
const userCreateAccount = document.getElementById("submitSignUp");
const createAccountForm = document.getElementById("signup");

userCreateAccount.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };

        showMessage('Account created successfully!', 'signUpMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(()=> {
            window.location.href='../home-page/home-page.html';
        })
        .catch((error)=> {
            console.error("Error Writing Document", error);
        });
    })
    .catch((error)=> {
        const errorCode = error.code;
        if(errorCode == 'auth/email-already-in-use'){
            showMessage('This Email ID is already in use. Please try another Email ID', "signUpMessage");
        }
        else{
            showMessage('Unable to create user', 'signUpMessage');
        }
    });
})

submitSignIn.addEventListener('click', (e)=> {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('You have successfully logged in!', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = '../home-page/home-page.html';
    })
    .catch((error)=> {
        const errorCode = error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect email or password entered. Please try again.', 'signInMessage');
        }
        else{
            showMessage('Account does not exist', 'signInMessage');
        }
    })
})

function showSignUpForm() {
    createAccountForm.style.display = 'block';
    signInForm.style.display = 'none';
}

function showSignInForm() {
    signInForm.style.display = 'block';
    createAccountForm.style.display = 'none';
}

createAccountButton.addEventListener('click', showSignUpForm);
signInButton.addEventListener('click', showSignInForm);

window.addEventListener("DOMContentLoaded", ()=> {
    if (window.location.hash === "#createAccount") {
        createAccountForm.style.display = 'block';
        signInForm.style.display = 'none';
    }
})