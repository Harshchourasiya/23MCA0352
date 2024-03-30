import {useState, useEffect} from 'react'
function App() {
  const [data, setData] = useState();
  useEffect(async()=> {
    const data1 = await fetch("http://localhost:3000/categories/Computer/product?n=10&sortBy=price&orderBy=DES&page=3");
    const jData = await data1.json();
    setData(jData);
  }, [])
  return (
    <div>
      {
        data.map((d,k)=> {
          return (
            <div>
              <h1>{d.productName}</h1>
              <p>{p.price}</p>
              <p>{p.discount}</p>
              <p>{p.rate}</p>
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
