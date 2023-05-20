import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore,collection,addDoc} from "@firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyB22ie3QgORTOYxyuAakwqGhnaanobITXs",
    authDomain: "marketappsystem.firebaseapp.com",
    projectId: "marketappsystem",
    storageBucket: "marketappsystem.appspot.com",
    messagingSenderId: "907311944795",
    appId: "1:907311944795:web:995fc48453c6ed72495b7e"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const createUserCollection = (name,surname,email) => {
    let userCollectionRef = collection(db,"users");
    return addDoc(userCollectionRef,{name,surname,email,balance:0,profileImageURL:""})
}

export const createShoppingRecords = (buyerId,products,evaluation) => {
  let shoppingCollection = collection(db,"shoppingRecords");
  if(evaluation != null){
    return addDoc(shoppingCollection,{buyerId,products:{...products},evaluation});
  }else{
    return addDoc(shoppingCollection,{buyerId,products:{...products}});
  }
  
} 



export const storage = getStorage(app);
export default app;