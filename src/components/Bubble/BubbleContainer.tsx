
"use client";
import { TagsWithNotes } from "@/app/api/tags/route";
import { fetcherClientCnm } from "@/utils/fetcher/fetcherCnm";
import { memo, useEffect, useState } from "react";
import Bubble from "./Bubble";





const BubbleContainer: React.FC =  () => {
  
  const [tagsWithNotes, setTagsWithNotes] = useState<TagsWithNotes[]>();


  useEffect(() => {
   
      fetcherClientCnm<TagsWithNotes[]>("/api/tags").then(res=>{
        if(res.body && res.body.data){
          setTagsWithNotes(res.body.data);
        }
      }).catch((err)=>{
        console.log(err);
      });

  },[])

  

  return (
    tagsWithNotes && (
      <div
        className="fixed bottom-16 sm:top-20 right-4 sm:right-6 
        w-full max-w-xs sm:max-w-md 
        h-auto min-h-[300px] max-h-[80vh] 
        flex items-center justify-center 
        cursor-pointer
        overflow-hidden"
      >
        {tagsWithNotes.map((tag) => (
          <Bubble
            key={tag.id}
            id={tag.id}
            number={tag.note_tags.length}
            text={tag.name}
            totalBubbles={tagsWithNotes.length}
          />
        ))}
      </div>
    )
  );
};

export default memo(BubbleContainer);
