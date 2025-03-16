import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import { createClient } from "@/utils/supabase/client";
import ColorThief from "colorthief";
import { ShowTag } from "@/app/models/showTag";
import { apiRoute, clientBaseURL } from "@/app/envConfig";

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
    const showData: any = { ...show };
    showData.service = showData.service.id;
    let query = supabase.from("show").upsert(showData)
    if (show.id === 0) showData.id = undefined;
    else query = query.match({id: show.id});
    const { error } = await query;
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export function getShowImageURL(showName: string, tile: boolean): string {
    const apiURL = `${apiRoute}/api/imageFetcher?path=showImages/resizedImages&imageName=`;
    const transformedName = encodeURIComponent(showName);
    const dimensions = tile ? "200x200" : "640x640";
    const showNameURL = `${apiURL}${transformedName}_${dimensions}.jpeg`;
    return showNameURL;
}

export async function fetchAverageColor(imageUrl: string): Promise<string> {
    const apiURL = `${apiRoute}/api/averageColor?imageUrl=${clientBaseURL}${imageUrl}`;
    const response = await fetch(apiURL);
    const { averageColor } = await response.json();
    return averageColor;
}

const colorCache: { [showName: string]: string } = {};

export async function getShowImage(showName: string, tile: boolean): Promise<ShowImage | null> {
    //const storage = firebaseStorage;

    // Create a reference under which you want to list
    //const imageRef = ref(storage, `showImages/resizedImages/${showName}_200x200.jpeg`);
    try {
        //const url = await getDownloadURL(imageRef);
        
        const url = getShowImageURL(showName, tile);
        if (colorCache[showName]) {
            console.log("Using cache");
            return { imageUrl: url, averageColor: colorCache[showName] };
        }
        //const response = await fetch(url);

        const image = new Image();
        image.src = "";
        image.src = url;
        image.crossOrigin = "Anonymous";

        await new Promise((resolve) => {
            image.onload = resolve;
        });

        const colorThief = new ColorThief();
        const [red, green, blue] = colorThief.getColor(image);
        //const [red, green, blue] = [0, 0, 0];

        const averageColor = `rgb(${red},${green},${blue})`;
        colorCache[showName] = averageColor;
        return { imageUrl: url, averageColor: averageColor };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function addShowTag(showId: string, tag: ShowTag): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("ShowTagRelationship").insert({showId: showId, tagId: tag.id});
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  }
  
export async function removeShowTag(showId: string, tag: ShowTag): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("ShowTagRelationship").delete().match({showId: showId, tagId: tag.id});
    if (error) {
      console.error(error);
      return false;
    }
    return true;
}