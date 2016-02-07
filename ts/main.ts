/// <reference path="lib/declare/moment.d.ts"/>
/// <reference path="lib/declare/jquery.d.ts"/>
moment.locale("ru")
class Config {
    maxLength:number = 15;
    minLength:number = 2;
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
interface NewPost {
    text:string;
    date:Object;
}
class MyLocalStorage extends Config {
    private _storage = [];
    private _storageName = this.storageName;

    private _updateStorage() {
        localStorage.setItem(this._storageName, JSON.stringify(this._storage.reverse()));
    }

    public getStorage() {
        if (localStorage.getItem(this._storageName)) {
            this._storage = (JSON.parse(localStorage.getItem(this._storageName)));
            return this._storage;
        } else {
            return [];
        }
    }

    public addToStorage(text:string) {
        var post:NewPost = {
            text: text,
            date: moment()
        };
        this._storage.push(post);
        this._updateStorage();
    }

    public delToStorage(index) {
        this._storage.splice(index, 1);
        this._updateStorage();
    }
}
$(()=> {
    class Post extends MyLocalStorage {
        private _result;
        private _valid:boolean = false;
        private _textPost:string;
        private _dateTransform(date:string):string {
            var today = moment(),
                dateStorage = moment(date),
                dateString = "";
            var result = today.diff(dateStorage, "minutes");
            for (var time in this.timeList) {
                if (result >= time) {
                    this.timeList[time] === "max" ? dateString = moment(date).calendar() : dateString = this.timeList[time]
                }
            }
            return dateString;
        }

        public getTextPost() {
            return this._textPost
        }

        public setTextPost(text) {
            this._textPost = text
        }

        public setValid(val:boolean) {
            this._valid = val
        }

        public getValid() {
            return this._valid
        }

        public $elements = {
            nothing: $("[data-post=noPost]"),
            form: $("form"),
            $postList: $(".postsList")
        };

        public displayStorage() {
            this._result = this.getStorage();
            if (this._result.length) {
                this.showStorageList();
            } else {
                this.$elements.nothing.removeClass("hidden");
            }
        }

        public updateCounter(object:string, count:number) {
            this.$elements.form.find("p:not(" + object + ")").hide().end()
                .find(object).show()
                .find("span").text(count);
        }

        public createPost(text:string, date:string) {
            return $("<div/>", {
                'class': "post",
                html: [$("<p/>", {
                    html: text
                }),
                    $("<div/>", {
                        'class': "time",
                        html: [$("<p/>", {
                            text: "Опубликованно&nbsp;",
                            html: $("<span/>", {
                                text: this._dateTransform(date)
                            })
                        }),
                            $("<button/>", {
                                'class': "btn btn-danger",
                                text: "Удалить"
                            })]
                    })]
            })
        }
        public showStorageList() {
            var postList = [],
                result = this._result;
            for (var postId in result.reverse()) {
                postList.push(this.createPost(result[postId].text, result[postId].date))
            }
            this.$elements.$postList.append(postList);
        }
    }
    var post:Post = new Post;
    post.displayStorage();
    post.$elements.form
        .on("submit", (e) => {
            e.preventDefault();
            if (post.getValid()) {
                post.addToStorage(post.getTextPost());
                post.$elements.$postList.prepend(post.createPost(post.getTextPost(), moment().format()));
                $(e.target).find('textarea').val("");
            }
        })
        .on("input", (e) => {
            var value:string = e.target.value;
            if (value.length < post.minLength) {
                post.setValid(false);
                post.updateCounter(".js-maxLength", post.minLength - value.length);
            } else if (value.length > post.maxLength) {
                post.setValid(false);
                post.updateCounter(".error", value.length - post.maxLength);
            } else {
                post.setValid(true);
                post.setTextPost(value);
                post.updateCounter(".js-minLength", post.maxLength - value.length);
            }
        });
    post.$elements.$postList.on("click","button",(e)=>{
        e.preventDefault();
        var $post = $(e.target).closest(".post");
        post.delToStorage($post.index() - 1);
        $post.remove();
    })
});