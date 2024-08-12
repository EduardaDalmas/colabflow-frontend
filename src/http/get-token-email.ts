interface GetTokenEmailRequest {
    email: string;
}

export async function getTokenEmail({ email }: GetTokenEmailRequest) {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/token`, {
        method: 'POST',
        body: JSON.stringify({ email })
    })

    const data: { id: string } = await response.json()

    return { token: data.id }
}