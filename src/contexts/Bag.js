import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

export const BagContext = createContext();

export function BagProvider({children}) {
  
  const [bag,setBag] = useState([]);
  const [bagCount,setBagCount] = useState(0);
  
  useEffect(() => {
    setBag(JSON.parse(localStorage.getItem("bag")) || []);
    setBagCount(Number(localStorage.getItem("bagcount")) || 0);
  },[]);

 

  useEffect(() => {
    localStorage.setItem("bag",JSON.stringify(bag));
    localStorage.setItem("bagcount",bagCount);
  },[bag,bagCount])


  const addToBag = (newCount,product) => {
    
    setBag(prev => {
        const existingItem = prev.find(item => item.product.id === product.id);
    
        if (existingItem) {
          const updatedBag = prev.map(item => {
            if (item.product.id === product.id) {
                setBagCount(prev => prev + newCount);
                return { ...item, count: item.count + newCount };
            }
            return item;
          });
    
          return updatedBag;
        }
        setBagCount(prev => prev + newCount);
        return [...prev, { count: newCount, product }];
      });
    
  }

  const removeFromBag = (productId) => {
    let i = 0;
    let flag = 0;
    let myBag = bag;
    let myCount = bagCount;
    while(i<myBag.length && flag == 0){
      if(myBag[i].product.id == productId){
        myCount -= myBag[i].count;
        myBag.splice(i,1);
        flag = 1;
      }
      i++;
    }
    if(flag == 1){
      setBag(myBag);
      setBagCount(myCount);
    }

  }

  return (
    <BagContext.Provider value={{bag,addToBag,bagCount,setBag,setBagCount,removeFromBag}}>
        {children}
    </BagContext.Provider>
  )
}

export const useBag = () => {
  return useContext(BagContext);
}
