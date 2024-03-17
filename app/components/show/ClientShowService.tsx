import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import { createClient } from "@/utils/supabase/client";
import { getDownloadURL, ref } from "firebase/storage";
import ColorThief from "colorthief";
import { ShowTag } from "@/app/models/showTag";
import { updateUserShowData } from "@/app/show/[showId]/UserShowDataService";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { imageUrlBase } from "@/app/firebaseConfig";


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
    var query = supabase.from("show").upsert(showData)
    if (show.id === 0) showData.id = undefined;
    else query = query.match({id: show.id});
    const { data, error } = await query;
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function getShowImageURL(showName: string, tile: boolean): Promise<string> {
    var baseURL = imageUrlBase;
    const transformedName = showName.replace(/ /g, "%20");
    const dimensions = tile ? "200x200" : "640x640";
    var showNameURL = `${baseURL}${transformedName}_${dimensions}.jpeg?alt=media`;
    return showNameURL;
}


export async function getShowImage(showName: string, tile: boolean): Promise<ShowImage | null> {
    //const storage = firebaseStorage;

    // Create a reference under which you want to list
    //const imageRef = ref(storage, `showImages/resizedImages/${showName}_200x200.jpeg`);
    try {
        //const url = await getDownloadURL(imageRef);
        const url = await getShowImageURL(showName, tile);
        //const response = await fetch(url);

        var image = new Image();
        image.src = "";
        image.src = url;
        //image.crossOrigin = "Anonymous";

        await new Promise((resolve) => {
            image.onload = resolve;
        });

        //const colorThief = new ColorThief();
        //const [red, green, blue] = colorThief.getColor(image);
        const [red, green, blue] = [0, 0, 0];

        const averageColor = `rgb(${red},${green},${blue})`;
        return { imageUrl: url, averageColor };
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