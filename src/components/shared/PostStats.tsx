import { useDeleteSavedpost, useGetCurrentUser, useLikepost, useSavepost } from "@/lib/react-query/quriesAndmutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import Loader  from "./Loader";
import React, {useState, useEffect } from 'react'

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({post, userId} : PostStatsProps) => {
    const likesList = post?.likes.map((user : Models.Document) => user.$id)

    const [likes, setLikes] = useState(likesList)
    const [isSaved, setIssaved] = useState(false)

    const {mutate : likePost } = useLikepost();
    const {mutate : savePost, isPending: isSavingPost } = useSavepost(); 
    const {mutate : deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedpost(); 

    const { data : currentUser} = useGetCurrentUser()

    const savedPostRecord = currentUser?.save.find((record : Models.Document) => record.post.$id === post?.$id)
    useEffect(() => {
        setIssaved(!!savedPostRecord)
    }, [currentUser])

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes]
        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        } else {
            newLikes.push(userId)
        }

        setLikes(newLikes)
        likePost({postId: post?.$id || '', likesArray : newLikes})
    }

    const handleSavePost = (e : React.MouseEvent) => {
        e.stopPropagation();
       

        if(savedPostRecord){
            setIssaved(false)
            deleteSavedPost(savedPostRecord.$id)
        } else {
            savePost({postId : post?.$id || '', userId})
            setIssaved(true)
        }

    }

  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img
                src={checkIsLiked(likes, userId) 
                    ? "/assets/icons/liked.svg" 
                    : "/assets/icons/like.svg"
                }
                alt="like"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={handleLikePost}
            />
            <p className="small-meduim lg:base-meduim">
                {likes.length}
            </p>
        </div>

        <div className="flex gap-2">
        {(isSavingPost ||  isDeletingSaved 
            ? <Loader/> 
            :<img
                src={isSaved 
                    ? "/assets/icons/saved.svg"
                    : "/assets/icons/save.svg"
                } 
                alt="like"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={handleSavePost}
            />
        )}
        </div>
    </div>
  )
}

export default PostStats