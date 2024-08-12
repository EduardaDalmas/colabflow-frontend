interface verifyTokenRequest {
    pin: string;
}

export async function verifyToken({ pin }: verifyTokenRequest) {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/token`, {
        method: 'POST',
        body: JSON.stringify({ pin })
    })

    const data: { id: string } = await response.json()

    return { token: data.id }
}