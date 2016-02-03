class Config {
    maxLength:number = 15;
    minLength:number = 1;
    timeUpdate:number = 60000;
    storageName:string = "postsStorage";
    timeList = {
        0: "Только что.",
        1: "1 минуту назад.",
        2: "2 минуты назад.",
        5: "Около 5 минут назад.",
        10: "Около 10 минут назад.",
        20: "Менее 30 минут назад.",
        30: "Более 30 минут назад.",
        50: "Час назад",
        90: "2 часа назад",
        120: "max"
    };
}
interface NewPost{
    text:string;
    date:Object;
}
class MyLocalStorage extends Config{
    private _storage = [];
    private _storageName= this.storageName;
    private _updateStorage(): void{
        localStorage.setItem(this._storageName, JSON.stringify(this._storage));
    }
    public responseLocalStorage() {
        this._storage = [];
        if(localStorage.getItem(this._storageName)){
            this._storage = (JSON.parse(localStorage.getItem(this._storageName)));
        }
        return this._storage;
    }
    public addToStorage(text:string){
        var post : NewPost ={
            text:text,
            date: new moment()
        };
        this._storage.push(post);
        this._updateStorage();
    }
}