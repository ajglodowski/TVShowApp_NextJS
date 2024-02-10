import { firebaseImageBaseURL, firebaseStorage, setFirebaseImageBaseURL } from "@/app/firebaseConfig";
import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import { createClient } from "@/utils/supabase/client";
import { getDownloadURL, ref } from "firebase/storage";
import ColorThief from "colorthief";


export async function getShow( showId: string ): Promise<Show | null> {
    const supabase = createClient();
    const { data: showData } = await supabase.from("show").select(ShowPropertiesWithService).match({id: showId}).single();
    
    if (!showData) { console.log("HEre"); return null;   }

    const show: Show = {
        ...showData,
        service: showData.service as unknown as Service
    };
    
    
    return show;
}

export async function updateShow(show: Show): Promise<boolean> {
    const supabase = createClient();
    var showData: any = { ...show };
    showData.service = showData.service.id;
    const { data, error } = await supabase.from("show").upsert(showData).match({id: show.id});
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function getShowImageURL(showName: string, tile: boolean): Promise<string> {
    if (!firebaseImageBaseURL) await setFirebaseImageBaseURL();
    var baseURL = firebaseImageBaseURL;
    var showNameURL = `${baseURL}${showName}_200x200.jpeg?alt=media`;
    return showNameURL;
}


export async function getShowImage(showName: string, tile: boolean): Promise<ShowImage | null> {
    const storage = firebaseStorage;

    // Create a reference under which you want to list
    //const imageRef = ref(storage, `showImages/resizedImages/${showName}_200x200.jpeg`);
    try {
        //const url = await getDownloadURL(imageRef);
        const url = await getShowImageURL(showName, tile);
        //const response = await fetch(url);

        const image = new Image();
        image.src = url;
        image.crossOrigin = "Anonymous";

        await new Promise((resolve) => {
            image.onload = resolve;
        });

        const colorThief = new ColorThief();
        const [red, green, blue] = colorThief.getColor(image);

        const averageColor = `rgb(${red},${green},${blue})`;
        return { imageUrl: url, averageColor };
    } catch (error) {
        console.error(error);
        return null;
    }
}
