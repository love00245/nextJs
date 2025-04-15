import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CollectionView() {
    const router = useRouter();
    const { name } = router.query;

    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!name) return;

        const fetchDocs = async () => {
            try {
                const res = await fetch(`/api/${name}`);
                const data = await res.json();
                setDocs(data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching documents:', err);
                setLoading(false);
            }
        };

        fetchDocs();
    }, [name]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>📂 Viewing Collection: {name}</h2>

            {loading || !docs?.length ? (
                <p>Loading...</p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: '20px',
                        marginTop: '30px'
                    }}
                >
                    {docs.map((doc) => (
                        <div key={doc._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {/* Show image if field exists */}
                            {doc.image_path && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={doc.image_path}
                                    alt="doc image"
                                    style={{ width: '400px', height: '400px', objectFit: 'cover' }}
                                />
                            )}

                            {/* Show fallback if image field not found */}
                            {!doc.image_path && (
                                <div style={{ height: '150px', backgroundColor: '#eee' }}>
                                    <p>No Image</p>
                                </div>
                            )}

                            <pre style={{ fontSize: '10px', marginTop: '10px', overflowX: 'auto' }}>
                                {JSON.stringify(doc, null, 2)}
                            </pre>
                        </div>
                    ))}s
                </div>
            )}
        </div>
    );
}
