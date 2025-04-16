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
                console.log(data);
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
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                        marginTop: '30px',
                        paddingRight: '10px'
                    }}
                >
                    {docs.map((doc) => (
                        <div key={doc._id} style={{ border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
                            {doc.image_path ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}
                                >
                                    <img
                                        src={doc.image_path}
                                        alt="doc"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            flexShrink: 0
                                        }}
                                    />
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>
                                            <strong>Unique Id:</strong> {doc.unique_id || 'N/A'}
                                        </h4>
                                        <h4 style={{ margin: 0, fontSize: '14px' }}>
                                            <strong>Source:</strong> {doc.source || 'Unknown'}
                                        </h4>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ height: '150px', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p style={{ fontSize: '12px' }}>No Image</p>
                                </div>
                            )}

                            {doc.image_path && (
                                <a
                                    href={doc.image_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '12px', display: 'inline-block', marginTop: '8px', color: '#0070f3' }}
                                >
                                    🔍 View Full
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}
