

export function getUserImageURL(username: string): string {
    return `https://storage.googleapis.com/tv-show-app-602d7.appspot.com/profilePics/${username}.jpg`
}


export async function getProfilePic (username: string): Promise<string|null> {
    try {
        const url = getUserImageURL(username);

        let image = new Image();
        image.src = "";
        image.src = url;
        //image.crossOrigin = "Anonymous";

        await new Promise((resolve) => {
            image.onload = resolve;
        });

        return url;
    } catch (error) {
        console.error(error);
        return null;
    }
}