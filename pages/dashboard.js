import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [limit] = useState(10); // default 10 per page
  const [total, setTotal] = useState(0);

  const fetchCollections = async (pageNum = 0) => {
    try {
      const offset = pageNum * limit;
      const res = await fetch(`/api/collections?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      setCollections(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  useEffect(() => {
    // Auth check
    if (typeof window !== 'undefined' && localStorage.getItem('auth') !== 'true') {
      router.push('/');
    } else {
      fetchCollections(page);
    }
  }, [page]); // trigger on page change

  const setPageHandler = (next = false) => {
    setPage(prev => (next ? prev + 1 : prev - 1));
    setCollections([]);
  };

  const filtered = collections.filter((col) =>
    col.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>📂 Mongo Collections</h1>

      <input
        type="text"
        placeholder="Search collections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', marginTop: '20px', width: '300px' }}
      />

      {!filtered.length ? (
        <div style={{ marginTop: "10px" }}>Loading...</div>
      ) : (
        <>
          <ul style={{ marginTop: '20px' }}>
            {filtered.map((col) => (
              <li key={col.name} style={{ marginBottom: '10px' }}>
                <a
                  href={`/collection/${col.name.replaceAll(" ", "-")}`}
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  <span>{col.name} ({col.count})</span>
                </a>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '30px' }}>
            <button
              disabled={page === 0}
              onClick={() => setPageHandler(false)}
              style={{ marginRight: '10px', padding: '6px 12px' }}
            >
              ⬅️ Previous
            </button>

            <button
              disabled={(page + 1) * limit >= total}
              onClick={() => setPageHandler(true)}
              style={{ padding: '6px 12px' }}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
