// // Import necessary modules
// "use client";

// import { ChangeEvent, useCallback, useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { IPost } from "types/Type";
// import Form from "@src/components/Form";
// import { toast } from "sonner";
// import axios from "axios";
// import { Dialog } from "@src/components/ui/dialog";

// const Updatemessage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const messageId = searchParams.get("id");
//   const [submitting, setIsSubmitting] = useState(false);
//   const [post, setPost] = useState<IPost>({
//     id: "",
//     message: "",
//     tag: "",
//     imageUrl: "",
//     audioUrl: "",
//   });

//   const getmessageDetails = useCallback(async () => {
//     try {
//       const response = await axios.get(`/api/posts/${messageId}`);
//       if (response.status !== 200) {
//         toast.error("Failed to fetch message details");
//         return;
//       }
//       const data = await response.data;
//       setPost({
//         id: data._id,
//         message: data.message,
//         tag: data.tag,
//         imageUrl: data.image,
//       });
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   }, [messageId]);

//   useEffect(() => {
//     if (messageId) getmessageDetails();
//   }, [messageId, getmessageDetails]);

//   const updatemessage = async (e: ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!messageId) {
//       alert("Missing messageId!");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       if (!post) {
//         console.error("Missing post data");
//         return;
//       }

//       const response = await axios.patch(`/api/posts/${messageId}`, {
//         message: post.message,
//         tag: post.tag,
//         imageUrl: post.imageUrl,
//       });

//       if (response.status === 200) {
//         router.push("/");
//         toast.success("message updated successfully");
//         return;
//       } else {
//         toast.error("Failed to update message");
//         return;
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       {post && (
//         <Form
//           type="Save"
//           post={post as IPost}
//           setPost={setPost}
//           submitting={submitting}
//           handleSubmit={updatemessage}
//         />
//       )}
//     </>
//   );
// };

// export default Updatemessage;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page