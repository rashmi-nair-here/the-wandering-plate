// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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

const kitchenPageNotLoggedIn = document.getElementById('user-not-logged-in');
const kitchenPageLoggedIn = document.getElementById('user-logged-in');

async function loadFavorites(userId) {
    const userRef = doc(db, "favorites", userId);
    const docSnap = await getDoc(userRef);

    const favoritesContainer = document.getElementById("favoritesContainer");

    if (docSnap.exists()) {
        const items = docSnap.data().items || [];

        if (items.length === 0) {
            favoritesContainer.innerHTML = "<p>Start saving some recipes to get started!</p>";
        } else {
            favoritesContainer.innerHTML = items.map(item => {
                const url = `/recipe-pages/${encodeURIComponent(item.country)}.html`;
                return `
                    <div class="country" id="${item.country.toLowerCase()}">
                        <div class="favoritesBox">
                            <h1><a href="${url}">${item.dish}</a></h1>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } else {
        favoritesContainer.innerHTML = "<p>Start saving some recipes to get started!</p>";
    }
}

// Call loadFavorites after confirming user is logged in
onAuthStateChanged(auth, async (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById('loggedUserName').innerText = userData.firstName + " " + userData.lastName;
            
            // Show logged-in section
            kitchenPageNotLoggedIn.style.display = 'none';
            kitchenPageLoggedIn.style.display = 'block';

            // Load favorites links
            loadFavorites(loggedInUserId);
        }
    }
});

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
loggedUserName.addEventListener('mouseover', (e)=>{
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
    }, 3000);
})