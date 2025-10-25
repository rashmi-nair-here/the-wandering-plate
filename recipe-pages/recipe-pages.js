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

async function saveFavorite(userId, item) {
    if (!userId) {
        alert("Please log in to save favorites!");
        return;
    }

    const userRef = doc(db, "favorites", userId);

    try {
        // Ensure items array exists
        await setDoc(userRef, { items: arrayUnion(item) }, { merge: true });
        alert(item + " saved to favorites!");
    } catch (error) {
        console.error("Error saving favorite:", error);
        alert("Could not save favorite. Make sure the items field is an array in Firestore.");
    }
}

document.querySelectorAll('.save-to-favorites').forEach(button => {
    button.addEventListener('click', async (e) => {
        const userId = localStorage.getItem('loggedInUserId');
        if (!userId) {
            alert("Please log in to save favorites!");
            return;
        }

        const dish = e.currentTarget.dataset.dish;
        const country = e.currentTarget.dataset.country;

        if (!dish || !country) {
            console.error("Dish or country is undefined. Check your button's data attributes!");
            return;
        }

        const favoriteItem = { dish, country };

        try {
            const userRef = doc(db, "favorites", userId);
            await setDoc(userRef, { items: arrayUnion(favoriteItem) }, { merge: true });
            alert(dish + " saved to favorites!");
        } catch (error) {
            console.error("Error saving favorite:", error);
            alert("Could not save favorite.");
        }
    });
});

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

const buttons = document.querySelectorAll("[data-carousel-button]");
buttons.forEach(button => {
    button.addEventListener('click', ()=> {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1;
        const slides = button.closest("[data-carousel]").querySelector('[data-slides]')

        const activeSlide = slides.querySelector('[data-active]')
        let newIndex = [...slides.children].indexOf(activeSlide) + offset
        if (newIndex < 0) newIndex = slides.children.length - 1
        if (newIndex >= slides.children.length) newIndex = 0

        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    })
});

const background = document.getElementById('overlay');
const nutritionalFacts = document.getElementById('nutritional-facts-box');
const nutititonalFactsBox = document.getElementById('nutritional-facts');
nutititonalFactsBox.addEventListener('click', (e) => {
    nutritionalFacts.style.display = 'block';
    background.style.display = 'block';
})

background.addEventListener('click', (e) => {
    nutritionalFacts.style.display = 'none';
    background.style.display = 'none';
})