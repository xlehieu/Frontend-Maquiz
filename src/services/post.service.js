import axiosCredentials from "./axios.credential";
export const createPost = async(data)=>{
    try{
    const {content, quizzes} = data;
    if(!content){
        throw "Phải có nội dung thông báo cho lớp học"
    }
    const res = await axiosCredentials.post('/post/create',JSON.stringify(content))
    if(res.status ===200)
        return "Đăng bài thành công"
    }
    catch(err){
        throw new Error("Đăng bài thông báo thất bại")
    }
}