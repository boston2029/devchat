import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, onValue, set, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyAvvVuH_CLm73LeGVdv0tKct2wUlazLmCg",
  authDomain: "libit-dev-chat.firebaseapp.com",
  projectId: "libit-dev-chat",
  storageBucket: "libit-dev-chat.appspot.com",
  messagingSenderId: "38313810117",
  appId: "1:38313810117:web:ef58a6f4825097bc3b38ac"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function makeid(length) {
  var result = [];
  var characters =
    "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

const formatDate = epoch => new Date(epoch).toLocaleString([], { month: 'numeric', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/(\d{2}\/\d{2}\/\d{2}, )?(\d{2}:\d{2})/, (match, p1, p2) => p1 && new Date().toDateString() === new Date(epoch).toDateString() ? p2 : match);

onValue(query(ref(db, "messages"), orderByChild("epoch")), (snapshot) => {
  document.querySelector("div").innerHTML=''
  snapshot.forEach(msg => {
    document.querySelector("div").innerHTML+=`<p><small>${msg.val().author} - ${formatDate(Date.now())}</small><br>${msg.val().msg}</p>`
  })
  document.querySelector("div").scrollTop=document.querySelector("div").scrollHeight
})

let name
if (localStorage.getItem("nick")==null) {
  name=prompt("Enter a name we'll know you by (can't be changed):")
  localStorage.setItem("nick", name)
} else {
  name = localStorage.getItem("nick")
}

function sendMsg() {
  if (document.getElementById("message").value.length==0) return;
  set(ref(db, "messages/"+makeid(10)), {
    author:name,
    msg:document.getElementById("message").value,
    epoch:Math.round(new Date().getTime()/1000)
  })
  document.getElementById("message").value=""
}


document.querySelector("button").onclick=sendMsg

document.getElementById("message").addEventListener('keyup', (e) => {
  if (e.key!="Enter") return;

  sendMsg()
})