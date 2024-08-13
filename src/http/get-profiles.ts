// interface getProfilesRequest {
//     email: string;
// }

export async function getProfiles() {
    // const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/token`, {
    //     method: 'POST',
    //     body: JSON.stringify({ email })
    // })

    // const data = await response.json()

    const data = [
        {
            id: "1",
            name: "WSS Security",
        },
        {
            id: "2",
            name: "IENH",
        },
    ]

    return data
}