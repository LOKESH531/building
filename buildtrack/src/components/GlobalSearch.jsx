import {useState} from "react";
import {collection,getDocs} from "firebase/firestore";
import {db} from "../firebase/firebaseConfig";
import {useNavigate} from "react-router-dom";

function GlobalSearch(){
  const [query,setQuery]=useState("");
  const [results,setResults]=useState([]);
  const navigate=useNavigate();

  const search=async(q)=>{
    setQuery(q);
    if(q.trim().length<2){setResults([]);return;}
    const lower=q.toLowerCase();
    const cols=["projects","workers","materials","expenses"];
    const all=[];
    for(const col of cols){
      const snap=await getDocs(collection(db,col));
      snap.docs.forEach(d=>{
        const data=d.data();
        const text=Object.values(data).join(" ").toLowerCase();
        if(text.includes(lower)) all.push({id:d.id,type:col,...data});
      });
    }
    setResults(all.slice(0,10));
  };

  const go=(item)=>{
    setResults([]);setQuery("");
    if(item.type==="projects") navigate(`/project-details/${item.id}`);
    else if(item.type==="workers") navigate("/workers");
    else if(item.type==="materials") navigate("/materials");
    else if(item.type==="expenses") navigate("/expenses");
  };

  return(
    <div className="search-wrapper">
      <input
        className="search-input"
        placeholder="🔍 Search projects, workers, materials..."
        value={query}
        onChange={e=>search(e.target.value)}
      />
      {results.length>0&&(
        <div className="search-dropdown">
          {results.map(r=>(
            <div key={r.id+r.type} className="search-result" onClick={()=>go(r)}>
              <span className="search-type">{r.type}</span>
              <span>{r.name||r.title||r.workerName||r.id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
