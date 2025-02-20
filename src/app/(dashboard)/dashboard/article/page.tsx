import { redirect } from "next/navigation";

export default function ArticlePage(){
    redirect("/dashboard/article/edit");
}