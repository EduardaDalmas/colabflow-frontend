interface createAccountRequest {
    nome: string;
    email: string;
}

export async function createAccount({ nome, email }: createAccountRequest) {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/token`, {
        method: 'POST',
        body: JSON.stringify({ nome, email })
    })

    const data: { id: string } = await response.json()

    return { token: data.id }
}