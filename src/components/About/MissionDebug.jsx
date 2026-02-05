import React, { useState, useEffect } from 'react';

const MissionDebug = () => {
    const [status, setStatus] = useState('initializing');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('MissionDebug useEffect triggered');
        setStatus('loading');

        const testFetch = async () => {
            try {
                console.log('About to fetch...');
                const response = await fetch('https://med-backend-d61c905599c2.herokuapp.com/api/mission/api/complete/');
                console.log('Fetch response:', response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Fetch result:', result);
                    setData(result);
                    setStatus('success');
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setStatus('error');
            }
        };

        testFetch();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Mission Debug Component</h1>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Error:</strong> {error || 'none'}</p>
            <p><strong>Data:</strong> {data ? 'loaded' : 'null'}</p>

            {data && (
                <div>
                    <h2>Data Preview:</h2>
                    <p>Mission Title: {data.mission?.title}</p>
                    <p>History Items: {data.history?.length}</p>
                </div>
            )}

            <details>
                <summary>Raw Data</summary>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
        </div>
    );
};

export default MissionDebug;