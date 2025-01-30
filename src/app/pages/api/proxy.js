export default async function handler(req, res) {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        return res.status(500).json({ error: "Backend URL is not configured" });
    }

    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let backendResponse;

        if (req.method === 'GET') {
            backendResponse = await fetch(`${backendUrl}${req.url}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        else if (req.method === 'POST') {
            backendResponse = await fetch(`${backendUrl}${req.url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body), 
            });
        }

        else if (req.method === 'DELETE') {
            backendResponse = await fetch(`${backendUrl}${req.url}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const data = await backendResponse.json();
        return res.status(backendResponse.status).json(data);

    } catch (error) {
        console.error("Proxy error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
