import { create } from 'zustand';

interface UserProfileLike {
    likeID: string,
    postId: string,
    userID: string
}

interface UserProfileLikeStore {
    likes: UserProfileLike[],
    addLike: (like: UserProfileLike) => void,
    removeLike: (likeId: string) => void,
    setAllLikes: (likes: UserProfileLike[]) => void,
    removeAllLikes:()=>void,

    
}

interface UserProfilePost {
    description: string,
    image: string,
    postId: string,
    status: string,
    time: string,
    userID: string
}

interface UserProfilePostStore {
    posts: UserProfilePost[],
    addPost: (post: UserProfilePost) => void,
    removePost: (postId: string) => void,
    setAllPosts: (posts: UserProfilePost[]) => void,
    removeAllPosts:()=>void,
}

interface UserProfileStore {
    userID: string,
    bio: string,
    profilePic: string,
    coverPic: string,
    residency: string,
    signed: string,
    usrName: string,
    setProfileData: (state: any) => void,
    setUserID: (state: string) => void,
    setBio: (state: string) => void,
    setProfilePic: (state: string) => void,
    setSchoolName: (state: string) => void,
    setClass: (state: string) => void,
    setUsrName: (state: string) => void,
    resetProfileData:()=>void,

}

const useUserProfileStore = create<UserProfileStore>((set) => ({
    userID: '',
    bio: '',
    profilePic: '',
    coverPic: '',
    residency: '',
    signed: '',
    treatyDate:'',
    usrName: '',
    setProfileData: (state) => set(()=>{
        return {
            userID: state.userID,
            bio: state.bio,
            profilePic: state.profilePic,
            coverPic: state.coverPic,
            residency: state.residency,
            treatyDate:state.treatyDate,
            signed: state.signed,
            usrName: state.usrName
        }
    }),
    resetProfileData: () => set(() => ({
        userID: '',
        bio: '',
        profilePic: '',
        coverPic: '',
        residency: '',
        signed: '',
        treatyDate: '',
        usrName: ''
    })),
    setUserID: (state) => set(()=>({ userID: state })),
    setBio: (state: string) => set(()=>({ bio: state })),
    setProfilePic: (state: string) => set(()=>({ profilePic: state })),
    setCoverPic: (state: string) => set(()=>({ coverPic: state })),
    setSchoolName: (state: string) => set(()=>({ residency: state })),
    setClass: (state: string) => set(()=>({ signed: state })),
    setUsrName: (state: string) => set(()=>({ usrName: state })),
}))

const usePostsStore = create<UserProfilePostStore>((set) => ({
    posts: [],
    addPost: post => set(state => ({
        posts: [ ...state.posts, post ]
    })),
    removePost: postId => set(state => {
        let index = state.posts.findIndex(value => value.postId === postId);

        if (index > -1)
            state.posts.splice(index, 1);

        return ({ posts: [ ...state.posts ] });
    }),
    setAllPosts: posts => set(() => ({ posts })),
    removeAllPosts: () => set(() => ({}))
}))

const useLikesStore = create<UserProfileLikeStore>((set) => ({
    likes: [],
    addLike: like => set(state => ({
        likes: [ ...state.likes, like ]
    })),
    removeLike: likeId => set(state => {
        let index = state.likes.findIndex(value => value.likeID === likeId);

        if (index > -1)
            state.likes.splice(index, 1);
        
        return ({ likes: [ ...state.likes ] })
    }),
    setAllLikes: likes => set(() => ({ likes })),
    removeAllLikes: () => set(() => ({  }))
}))

export default useUserProfileStore
export { usePostsStore, useLikesStore }