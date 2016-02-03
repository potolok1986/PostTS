var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Config = (function () {
    function Config() {
        this.maxLength = 15;
        this.minLength = 1;
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
        localStorage.setItem(this._storageName, JSON.stringify(this._storage));
    };
    MyLocalStorage.prototype.responseLocalStorage = function () {
        this._storage = [];
        if (localStorage.getItem(this._storageName)) {
            this._storage = (JSON.parse(localStorage.getItem(this._storageName)));
        }
        return this._storage;
    };
    MyLocalStorage.prototype.addToStorage = function (text) {
        var post = {
            text: text,
            date: new moment()
        };
        this._storage.push(post);
        this._updateStorage();
    };
    return MyLocalStorage;
})(Config);
//# sourceMappingURL=main.js.map