// interface getProfilesRequest {
//     email: string;
// }

export async function getGroups() {
    // const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/token`, {
    //     method: 'POST',
    //     body: JSON.stringify({ email })
    // })

    // const data = await response.json()

    const data = [
        {
            id: "1",
            name: "Projeto Experimental",
            priority: "high"
        },
        {
            id: "2",
            name: "Engenharia de software",
            priority: "high"
        },
    ]

    return data
}