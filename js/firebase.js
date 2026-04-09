// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBX0Hnb2Ay7C5sb56ZVsg6lDN-08RwMQc",
  authDomain: "moodstrip-5f881.firebaseapp.com",
  projectId: "moodstrip-5f881",
  storageBucket: "moodstrip-5f881.firebasestorage.app",
  messagingSenderId: "438675865782",
  appId: "1:438675865782:web:94b779450188becf39a617",
  measurementId: "G-0VJF4T0NHG"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

// Upload function
async function uploadStripToFirebase(dataURL) {
  const res = await fetch(dataURL);
  const blob = await res.blob();

  const fileName = `strips/moodstrip_${Date.now()}.png`;
  const ref = storage.ref().child(fileName);

  await ref.put(blob);
  const url = await ref.getDownloadURL();

  return url;
}