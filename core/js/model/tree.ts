﻿module FoodParent {
    export class Tree extends Backbone.Model {
        url: string = "tree.php";
        private isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var self: Tree = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "lat": 0,
                "lng": 0,
                "address": "",
                "food": 0,
                "type": 0,
                "flag": 0,
                "owner": 0,
                "ownership": 0,
                "description": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
            /*
            self.off("change");
            self.on("change", function (model: Tree, options) {
                if (self.isSavable == false) return;
                self.isSavable = false;
                model.save(
                    {},
                    {
                        wait: true,
                        success: function (tree: Tree, response: any) {
                            console.log(tree);
                            self.isSavable = true;
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            EventHandler.handleDataChange("<i>" + food.getName() + " " + tree.getName() + "</i> has been changed successfully", true);
                        },
                        error: function (error, response) {
                            self.isSavable = true;
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        },
                    }
                );
            });
            */

        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.lat = parseFloat(response.lat);
            response.lng = parseFloat(response.lng);
            response.food = parseInt(response.food);
            response.type = parseInt(response.type);
            response.flag = parseInt(response.flag);
            response.owner = parseInt(response.owner);
            response.ownership = parseInt(response.ownership);
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());

            response.parents = Model.getAdopts().getParentIds(response.id);
            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            delete clone["parents"];
            return clone;
        }
        public getFoodId(): number {
            return this.get('food');
        }
        public getFlagId(): number {
            return this.get('flag');
        }
        public getOwnershipId(): number {
            return Math.floor(this.get('ownership'));
        }
        public getName(): string {
            var self: Tree = this;
            return ' #' + self.getId();
        }
        public getLat(): number {
            return parseFloat(this.get('lat'));
        }
        public getLng(): number {
            return parseFloat(this.get('lng'));
        }
        public getId(): number {
            return Math.floor(this.id);
        }

        public getLocation(): L.LatLng {
            return new L.LatLng(this.getLat(), this.getLng());
        }
        public getDescription(): string {
            if (this.get('description') == "") {
                return "&nbsp;";
            }
            return this.get('description');
        }
    }
    export class Trees extends Backbone.Collection<Tree> {
        url: string = "trees.php";
        constructor(models?: Tree[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Tree;
        }

        public getIds(): Array<number> {
            var self: Trees = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Tree) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }

        public getFoodIds(): Array<number> {
            var self: Trees = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Tree) {
                if (result.indexOf(model.getFoodId()) == -1) {
                    result.push(model.getFoodId());
                }
            });
            return result;
        }

        public getFlagIds(): Array<number> {
            var self: Trees = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Tree) {
                if (result.indexOf(model.getFlagId()) == -1) {
                    result.push(model.getFlagId());
                }
            });
            return result;
        }

        public filterByIds(idArray): Array<Tree> {
            var self: Trees = this;
            var trees: Trees = new Trees(self.models);
            return trees.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        }

        public filterByFoodIds(idArray): Trees {
            var self: Trees = this;
            var trees: Trees = new Trees(self.models);
            return new Trees(trees.filter(function (tree: Tree, index: number) {
                if ($.inArray(tree.getFoodId(), idArray) > -1) {
                    return true;
                }
                return false;
            }));
        }

        public getAssigned(trees: Trees): Trees {
            var self: Trees = this;
            $.each(self.models, function (index: number, model: Tree) {
                if (model.get('parents').length >= 1) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        }

        public getUnassigned(trees: Trees): Trees {
            var self: Trees = this;
            $.each(self.models, function (index: number, model: Tree) {
                if (model.get('parents').length == 0) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }

                }
            });
            return trees;
        }

        public getFromFoodId(trees: Trees, id: number): Trees {
            var self: Trees = this;
            $.each(self.models, function (index: number, model: Tree) {
                if (model.getFoodId() == id) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        }
    }
}