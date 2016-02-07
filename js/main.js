var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="lib/declare/moment.d.ts"/>
/// <reference path="lib/declare/jquery.d.ts"/>
moment.locale("ru");
var Config = (function () {
    function Config() {
        this.maxLength = 15;
        this.minLength = 2;
        this.timeUpdate = 60000;
        this.storageName = "postsStorage";
        this.timeList = {
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
    return Config;
})();
var MyLocalStorage = (function (_super) {
    __extends(MyLocalStorage, _super);
    function MyLocalStorage() {
        _super.apply(this, arguments);
        this._storage = [];
        this._storageName = this.storageName;
    }
    MyLocalStorage.prototype._updateStorage = function () {
        localStorage.setItem(this._storageName, JSON.stringify(this._storage.reverse()));
    };
    MyLocalStorage.prototype.getStorage = function () {
        if (localStorage.getItem(this._storageName)) {
            this._storage = (JSON.parse(localStorage.getItem(this._storageName)));
            return this._storage;
        }
        else {
            return [];
        }
    };
    MyLocalStorage.prototype.addToStorage = function (text) {
        var post = {
            text: text,
            date: moment()
        };
        this._storage.push(post);
        this._updateStorage();
    };
    MyLocalStorage.prototype.delToStorage = function (index) {
        this._storage.splice(index, 1);
        this._updateStorage();
    };
    return MyLocalStorage;
})(Config);
$(function () {
    var Post = (function (_super) {
        __extends(Post, _super);
        function Post() {
            _super.apply(this, arguments);
            this._valid = false;
            this.$elements = {
                nothing: $("[data-post=noPost]"),
                form: $("form"),
                $postList: $(".postsList")
            };
        }
        Post.prototype._dateTransform = function (date) {
            var today = moment(), dateStorage = moment(date), dateString = "";
            var result = today.diff(dateStorage, "minutes");
            for (var time in this.timeList) {
                if (result >= time) {
                    this.timeList[time] === "max" ? dateString = moment(date).calendar() : dateString = this.timeList[time];
                }
            }
            return dateString;
        };
        Post.prototype.getTextPost = function () {
            return this._textPost;
        };
        Post.prototype.setTextPost = function (text) {
            this._textPost = text;
        };
        Post.prototype.setValid = function (val) {
            this._valid = val;
        };
        Post.prototype.getValid = function () {
            return this._valid;
        };
        Post.prototype.displayStorage = function () {
            this._result = this.getStorage();
            if (this._result.length) {
                this.showStorageList();
            }
            else {
                this.$elements.nothing.removeClass("hidden");
            }
        };
        Post.prototype.updateCounter = function (object, count) {
            this.$elements.form.find("p:not(" + object + ")").hide().end()
                .find(object).show()
                .find("span").text(count);
        };
        Post.prototype.createPost = function (text, date) {
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
            });
        };
        Post.prototype.showStorageList = function () {
            var postList = [], result = this._result;
            for (var postId in result.reverse()) {
                postList.push(this.createPost(result[postId].text, result[postId].date));
            }
            this.$elements.$postList.append(postList);
        };
        return Post;
    })(MyLocalStorage);
    var post = new Post;
    post.displayStorage();
    post.$elements.form
        .on("submit", function (e) {
        e.preventDefault();
        if (post.getValid()) {
            post.addToStorage(post.getTextPost());
            post.$elements.$postList.prepend(post.createPost(post.getTextPost(), moment().format()));
            $(e.target).find('textarea').val("");
        }
    })
        .on("input", function (e) {
        var value = e.target.value;
        if (value.length < post.minLength) {
            post.setValid(false);
            post.updateCounter(".js-maxLength", post.minLength - value.length);
        }
        else if (value.length > post.maxLength) {
            post.setValid(false);
            post.updateCounter(".error", value.length - post.maxLength);
        }
        else {
            post.setValid(true);
            post.setTextPost(value);
            post.updateCounter(".js-minLength", post.maxLength - value.length);
        }
    });
    post.$elements.$postList.on("click", "button", function (e) {
        e.preventDefault();
        var $post = $(e.target).closest(".post");
        post.delToStorage($post.index() - 1);
        $post.remove();
    });
});
//# sourceMappingURL=main.js.map