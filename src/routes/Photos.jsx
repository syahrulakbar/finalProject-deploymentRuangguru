import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("asc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePhoto = async (id) => {
    await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
      method: "DELETE",
    });
    setPhotos(photos.filter((x) => x.id !== id));
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const paramsObj = { _sort: "id", _order: `${sort}`, q: `${submited}` };
        const searchParams = new URLSearchParams(paramsObj);
        const response = await fetch(`https://gallery-app-server.vercel.app/photos?${searchParams}`);
        const responseJson = await response.json();
        setPhotos(responseJson);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    loadData();
  }, [sort, submited]);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const response = await fetch("https://gallery-app-server.vercel.app/photos");
        const responseJson = await response.json();
        setPhotos(responseJson);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    loadData();
  }, []);

  if (error) return <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select onChange={(e) => setSort(e.target.value)} data-testid="sort" className="form-select" style={{}}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input type="text" data-testid="search" onChange={(e) => setSearch(e.target.value)} className="form-input" />
            <input type="submit" value="Search" data-testid="submit" className="form-btn" />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Loading...</h1>
          ) : (
            photos.map((photo) => {
              return <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
