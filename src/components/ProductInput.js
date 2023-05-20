import React, { useEffect, useState } from "react";
import { useBag } from "../contexts/Bag";

function ProductInput({product}) {
  const [count, setCount] = useState(0);
  
  
  let increaseCount = () => {
    setCount(count+1);
  }
  let decreaseCount = () => {
    if(count != 0){
        setCount(count-1);
    }
  }
  let handleChange = (e) => {
    e.target.value = count;
  }
  
  let {addToBag} = useBag();

  let addForCard = () => {
    if(count != 0){
        addToBag(count,product);
        setCount(0);
    }
    
      
  }
  return (
    <div className="product" key={product.id}>
      <img className="product-image" src={product.url} />
      <a className="product-name">{product.name}</a>
      <div className="prod-inputs">
        <button className="mini-btn" onClick={decreaseCount}>-</button>
        <input
          className="product-count"
          value={count}
          type="number"
          onChange={handleChange}
          aria-valuemin={0}
          id={`productCountFor${product.id}`}
        />
        <button
          className="mini-btn"
          onClick={increaseCount}
        >
          +
        </button>
      </div>

      <a className="product-price">$ {product.price}</a>

      <button className="addToCart" onClick={addForCard}>Add to Cart</button>
    </div>
  );
}

export default ProductInput;
