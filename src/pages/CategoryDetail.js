import React, { useEffect,useRef,useState } from 'react'
import Navbar from '../components/Navbar'
import {db} from "../Firebase"
import { useParams } from 'react-router-dom'
import { collection, query, where ,getDocs} from "firebase/firestore";
import ProductInput from '../components/ProductInput';
function CategoryDetail() {
    const {catName} = useParams();
    const [products,setProducts] = useState([]);
    
    
    useEffect(() => {
        let getProductions = async () => {
            const productsRef = collection(db, "products");
            const q = query(productsRef, where("category", "==", catName));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setProducts(prev => [...prev,{...doc.data()}]);
            });
        }
        getProductions();
    },[catName]);
    
  return (
    <>
    <Navbar />
    <div className='container'>
        {/* {console.log(products)} */}
        <h2 className='section-title'>All Products for <span className='text-orange'>{catName}</span> </h2>
        <div className='products'>
            {products.map((product)=>(
                <ProductInput key={product.id} product={product}></ProductInput>
            ))}
            
        </div>
        
    </div>
    
    </>
    
  )
}

export default CategoryDetail