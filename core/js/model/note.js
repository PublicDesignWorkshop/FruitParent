var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    (function (SortType) {
        SortType[SortType["NONE"] = 0] = "NONE";
        SortType[SortType["DESCENDING"] = 1] = "DESCENDING";
        SortType[SortType["ASCENDING"] = 2] = "ASCENDING";
    })(FoodParent.SortType || (FoodParent.SortType = {}));
    var SortType = FoodParent.SortType;
    (function (NoteType) {
        NoteType[NoteType["NONE"] = 0] = "NONE";
        NoteType[NoteType["IMAGE"] = 1] = "IMAGE";
        NoteType[NoteType["INFO"] = 2] = "INFO";
        NoteType[NoteType["PICKUP"] = 3] = "PICKUP";
    })(FoodParent.NoteType || (FoodParent.NoteType = {}));
    var NoteType = FoodParent.NoteType;
    var Note = (function (_super) {
        __extends(Note, _super);
        function Note(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "note.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "type": 0,
                "tree": 0,
                "person": 0,
                "comment": "",
                "picture": "",
                "rate": 0,
                "date": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Note.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.type = parseFloat(response.type);
            response.tree = parseFloat(response.tree);
            response.person = parseInt(response.person);
            response.rate = parseFloat(response.rate);
            response.date = moment(response.date).format(FoodParent.Setting.getDateTimeFormat());
            return _super.prototype.parse.call(this, response, options);
        };
        Note.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Note.prototype.getId = function () {
            return Math.floor(this.id);
        };
        Note.prototype.getComment = function () {
            return this.get('comment');
        };
        Note.prototype.getPicturePath = function () {
            return FoodParent.Setting.getContentPictureDir() + this.get('picture');
        };
        Note.prototype.getFakePicturePath = function () {
            return FoodParent.Setting.getCoreImageDir() + "placeholder-image.jpg";
        };
        Note.prototype.getFormattedDate = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateFormat());
        };
        Note.prototype.getFormattedDateTime = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateTimeFormat());
        };
        Note.prototype.getDateValueOf = function () {
            return moment(this.get('date')).valueOf();
        };
        Note.prototype.getRate = function () {
            return parseFloat(this.get('rate'));
        };
        return Note;
    })(Backbone.Model);
    FoodParent.Note = Note;
    var Notes = (function (_super) {
        __extends(Notes, _super);
        function Notes(models, options) {
            _super.call(this, models, options);
            this.url = "notes.php";
            this.sortType = SortType.NONE;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Note;
        }
        Notes.prototype.comparator = function (model) {
            var that = this;
            switch (that.sortType) {
                case SortType.NONE:
                    return 0;
                    break;
                case SortType.ASCENDING:
                    return model.getDateValueOf();
                    break;
                case SortType.DESCENDING:
                    return -model.getDateValueOf();
                    break;
            }
        };
        Notes.prototype.sortByDescendingDate = function () {
            var that = this;
            that.sortType = SortType.DESCENDING;
            that.sort();
        };
        Notes.prototype.sortByAscendingDate = function () {
            var that = this;
            that.sortType = SortType.ASCENDING;
            that.sort();
        };
        return Notes;
    })(Backbone.Collection);
    FoodParent.Notes = Notes;
})(FoodParent || (FoodParent = {}));