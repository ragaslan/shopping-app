import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useBag } from "../contexts/Bag";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/Auth";
import { createShoppingRecords } from "../Firebase";
import { db } from "../Firebase";
import { collection, query, where, getDocs,doc,updateDoc, getDoc, getDocFromServer } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { evaluateSchema } from "../forms/EvalutionForm";
function Bag() {
  let { removeFromBag, bag,setBag,setBagCount} = useBag();
  let { user, profile,setProfile } = useAuth();
  let [evaluateForm,setEvaluateForm] = useState({
    "answer1" : null,
    "answer2" : null,
    "answer3" : null,
    "comment" : ""
  });
  let outerRef = useRef();
  let [popupVisibility,setPopupVisibility] = useState(false);
  let navigate = useNavigate();
  let total = 0;
  let location = useLocation();
  useEffect(() => {
    if(location.search){
      let key = location.search.split("?")[1].split("=")[0];
      let val = location.search.split("?")[1].split("=")[1];
      if(key == "shopSuccess" && val == "true"){
        toast.success("order completed !");
      }
    }
  },[location]);

  let handleSelect = (e) => {
    let val;
    if(e.target.id != "comment" ){
      if(e.target.value == "true"){
        val = true;
      }else{
        val = false;
      }
    }else{
      val = e.target.value;
    }
    evaluateForm[e.target.id] = val;
  }

  let setBalance = async (newBalance) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", profile.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async(myDoc) => {
      try {
        const userRef = doc(db, "users", myDoc.id);
        const newFields = { "balance": parseFloat(newBalance)};
        updateDoc(userRef, newFields).then(() => setProfile(prev => ({...prev,balance:newBalance})));
        
      } catch (error) {
        console.log(error);
      }
      
      
    });
  }
  let setNewPiecesForProducts = async (bag)=> {
    bag.forEach(async(bagItem) => {
      let prodsRef = collection(db,"products");
      let q = query(prodsRef,where("id","==",bagItem.product.id));
      let prod = await getDocs(q);
      prod.forEach(async(myProd) => {
        let ref =  doc(db,"products",myProd.id);
        await updateDoc(ref,{piece: bagItem.product.piece - bagItem.count});
      });
    })
  }

  let handleLater = async() => {
    try {
      if(profile.balance < total){
        setPopupVisibility(false);
        toast.error("insufficient balance !");
      }else{
        await setNewPiecesForProducts(bag);
        await orderLogic(null);
        await setBalance(parseFloat(profile.balance - total));
        setPopupVisibility(false);
        navigate("/bag?shopSuccess=true");
      }
      
    } catch (error) {
      console.log(error);
    }
    
  }
  
  let handleSend = async() => {
    try {
      await evaluateSchema.validate(evaluateForm);
      if(profile.balance < total){
        setPopupVisibility(false);
        toast.error("insufficient balance !");
      }else{
        await setNewPiecesForProducts(bag);
        await orderLogic(evaluateForm);
        await setBalance(parseFloat(profile.balance - total));
        setPopupVisibility(false);
        navigate("/bag?shopSuccess=true");
      }
    } catch (error) {
      toast.error(error.message);
    }
    
  }

  let orderLogic = async(evaluation) => {
    let orderProducts = {};
      bag.forEach((bagItem) => {
        orderProducts[bagItem.product.name] = bagItem.count;
      });

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", profile.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (myDoc) => {
        try {
          await createShoppingRecords(myDoc.id, orderProducts,evaluation); 
          // sepeti boşaltma işlemi
          setBag([]);
          setBagCount(0);
        } catch (error) {
          console.log(error);
        }
      });
  }

  let order = async () => {
    let isThereError = false;
    bag.forEach((bagItem) => {
      if (bagItem.count > bagItem.product.piece) {
        isThereError = true;
        return toast.error(
          "insufficient stock to order" + bagItem.product.name
        );
      }
    });
    if (!isThereError) {
      setPopupVisibility(true);
    }
  };

  return (
    <>

      <Navbar />
      <div className="container">
        <div className={popupVisibility ? "evaluate-outer" :"evaluate-outer d-none" }>
          
          <div className="evaluate-pop">
          <div className="close-btn" onClick={() => setPopupVisibility(false)}>X</div>
            <form className="evaluate-form">
              <div className="input-group-q">
                <div className="question">
                  Are you satisfied with the quality of the products ?
                </div>
                <label htmlFor="answer1">Yes/No</label>
                <select name="answer1" id="answer1" onChange={handleSelect}>
                  <option value="">--Please choose an option--</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="input-group-q">
                <div className="question">
                  Are you satisfied with the delivery ?
                </div>
                <label htmlFor="answer2">Yes/No</label>
                <select name="answer2" id="answer2" onChange={handleSelect}>
                  <option value="">--Please choose an option--</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="input-group-q">
                <div className="question">
                  Are prices of products affordable ?
                </div>
                <label htmlFor="answer3">Yes/No</label>
                <select name="answer3" id="answer3" onChange={handleSelect}>
                  <option value="">--Please choose an option--</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="input-group-q">
                <label htmlFor="comment">Your Comment:</label>
                <textarea id="comment" onChange={handleSelect}></textarea>
              </div>

              <div className="evaluate-btns">
                <a className="evaluate-btn btn-pass" onClick={handleLater}>Later</a>
                <a className="evaluate-btn btn-submit" onClick={handleSend}>Send</a>
              </div>

            </form>
          </div>
        </div>

        <h2 className="section-title">My Cart</h2>
        <div className="cart-items">
          {bag.length > 0 &&
            bag.map((myCart, index) => (
              <div className="cart-item" key={index}>
                <img className="cart-image" src={myCart.product.url} />
                <div className="cart-name">{myCart.product.name}</div>
                <div className="cart-count">{myCart.count}</div>
                <div className="cart-price">$ {myCart.product.price}</div>
                <div className="cart-total">
                  Total: $
                  {parseFloat(
                    myCart.product.price * Number(myCart.count)
                  ).toFixed(2)}
                </div>
                <a
                  className="cart-remove"
                  onClick={() => removeFromBag(myCart.product.id)}
                >
                  Remove
                </a>
              </div>
            ))}

          {bag.length == 0 && (
            <div className="cart-item no-items">
              <span className="no-msg">There are no items in your cart!</span>
            </div>
          )}
        </div>
        {bag.length > 0 && (
          <>
            <a className="total-cost">
              Total Order Price{" "}
              {bag.forEach((item) => {
                total += item.count * item.product.price;
              })}{" "}
              <span className="text-orange" style={{ marginLeft: "5px" }}>
                ${total.toFixed(2)}
              </span>
            </a>
            <a className="buy-btn" onClick={order}>
              Order All
            </a>
          </>
        )}
      </div>
    </>
  );
}

export default Bag;
