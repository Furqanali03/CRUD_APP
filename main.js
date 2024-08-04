import {
    signOut,
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
  import { auth, db } from "./config.js";
  import {
    collection,
    addDoc,
    getDocs,
    Timestamp,
    orderBy,
    query,
    deleteDoc,
    doc,
    updateDoc
  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
      window.location = "index.html";
    }
  });
  
  const signOutBtn = document.querySelector("#signOutBtn");
  const form = document.querySelector("#form");
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  const card = document.querySelector("#card");
  
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location = "index.html";
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  
  if (form && card) {
    let editDocId = null;
    const arr = [];
  
    async function getDataFromFirebase() {
      arr.length = 0;
      card.innerHTML = ""; // Clear the card element before appending new data
      const q = query(collection(db, "post"), orderBy("postDate", "desc"));
      const querySnapshot = await getDocs(q);
      arr.length = 0; // Clear the array before pushing new data
      querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      arr.forEach((item) => {
        card.innerHTML += `
          <div class="card mt-2" data-id="${item.id}">
            <div class="card-body">
              <p><span class="h4">Title :</span> ${item.title}</p>
              <p><span class="h4">Description :</span> ${item.description}</p>
              <button type="button" class="btn btn-danger delete">Delete</button>
              <button type="button" class="btn btn-success edit">Edit</button>
            </div>
          </div>`;
      });
    }
  
    getDataFromFirebase();
  
    card.addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete")) {
        const cardElement = event.target.closest(".card");
        const docId = cardElement.getAttribute("data-id");
        await deleteDoc(doc(db, "post", docId));
        getDataFromFirebase();
      }
  
      if (event.target.classList.contains("edit")) {
        const cardElement = event.target.closest(".card");
        const docId = cardElement.getAttribute("data-id");
        const docData = arr.find((item) => item.id === docId);
        title.value = docData.title;
        description.value = docData.description;
        editDocId = docId; // Store the ID of the document being edited
      }
    });
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log(title.value);
      console.log(description.value);
  
      try {
        if (editDocId) {
          // Update existing document
          await updateDoc(doc(db, "post", editDocId), {
            title: title.value,
            description: description.value,
            postDate: Timestamp.fromDate(new Date())
          });
          editDocId = null; // Reset editDocId after update
        } else {
          // Add new document
          await addDoc(collection(db, "post"), {
            title: title.value,
            description: description.value,
            uid: auth.currentUser.uid,
            postDate: Timestamp.fromDate(new Date())
          });
        }
        form.reset(); // Clear the form
        getDataFromFirebase();
      } catch (e) {
        console.error("Error adding/updating document: ", e);
      }
    });
  }
  