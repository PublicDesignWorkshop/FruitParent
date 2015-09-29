var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FoodParent;
(function (FoodParent) {
    var HeaderView = (function (_super) {
        __extends(HeaderView, _super);
        function HeaderView(options) {
            _super.call(this, options);
            this.bActive = true;
            var that = this;
            that.events = {
                "click .nav-home": "_navHome",
                "click .nav-trees": "_navTrees",
                "click .nav-note": "_navNote",
                "click .nav-about": "_navAbout",
            };
            that.delegateEvents();
            that.views = new Array();
        }
        HeaderView.prototype.render = function () {
            var that = this;
            // add a new view
            var template = _.template(FoodParent.Template.getInstance().getMainHeaderTemplate());
            var data = {
                site: FoodParent.Localization.getInstance().getSiteText(),
                trees: FoodParent.Localization.getInstance().getTreesText(),
                note: FoodParent.Localization.getInstance().getNoteText(),
                about: FoodParent.Localization.getInstance().getAboutText(),
            };
            that.$el.html(template(data));
            return that;
        };
        /*
        _clickName(event: Event): void {
            var that: HeaderView = this;
            that.bExpanded = !that.bExpanded;

            if (that.bExpanded) {
                //new DetailView({ model: this.model, el: this.$('.detail') }).render();
            } else {
                //this.$('.detail').empty();
            }
            event.preventDefault();
        }
        */
        HeaderView.prototype._navHome = function (event) {
            event.preventDefault();
            FoodParent.Router.getInstance().navigate("home", { trigger: true, replace: false });
        };
        HeaderView.prototype._navTrees = function (event) {
            event.preventDefault();
            FoodParent.Router.getInstance().navigate("trees", { trigger: true, replace: false });
        };
        HeaderView.prototype._navNote = function (event) {
            event.preventDefault();
            FoodParent.Router.getInstance().navigate("note", { trigger: true, replace: false });
        };
        HeaderView.prototype._navAbout = function (event) {
            event.preventDefault();
            FoodParent.Router.getInstance().navigate("about", { trigger: true, replace: false });
        };
        return HeaderView;
    })(Backbone.View);
    FoodParent.HeaderView = HeaderView;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=headerview.js.map