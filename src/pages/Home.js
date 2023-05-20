import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import { useAuth } from "../contexts/Auth";
import Navbar from "../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { storage } from "../Firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryImageList, setCategoryImageList] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const productsCollectionRef = collection(db, "products");
  const categoriesCollectionRef = collection(db, "categories");
  const catImageRef = ref(storage, "images/categoryImages");
  const breadCrumbItems = ["All Category"];
  let iter = 0;
  useEffect(() => {
    const getCategories = async () => {
      let data = await getDocs(categoriesCollectionRef);
      setCategoryList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    // const getProducts = async () => {
    //   let data = await getDocs(productsCollectionRef);
    //   setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // };
    getCategories();
    //getProducts();
  }, []);

  // useEffect(() => {
  //   setSelectedProducts(
  //     products.filter((product) => product.category == selectedCat)
  //   );
  // }, [selectedCat]);

  // useEffect(() => {
  //   listAll(catImageRef).then((res) => {
  //     res.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         let title = url.split(".")[4].split("2F")[2];
  //         setCategoryImageList((prev) => [...prev, { url, title }]);
  //       });
  //     });
  //   });
  // }, []);

  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="container ">
      <h2 className="section-title">All Categories</h2>
        {categoryList && (
          <div className="categories">
            {categoryList.map((cat) => (
              <a
                className="cat-btn"
                href={"/category/"+ cat.name}
                key={cat.id}
              >
                <img src={"https://firebasestorage.googleapis.com/v0/b/marketappsystem.appspot.com/o/images%2FcategoryImages%2F" + cat.name + ".jpg?alt=media&token=66e31d26-a691-4085-b080-666b4c58c665"} />
                <span className="cat-name">{cat.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
